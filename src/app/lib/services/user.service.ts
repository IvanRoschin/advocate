import bcrypt from 'bcryptjs';

import { baseUrl, routes } from '@/app/config/routes';
import { generatePassword } from '@/app/helpers';
import {
  NotFoundError,
  ValidationError,
} from '@/app/lib/server/errors/httpErrors';
import { tokenService } from '@/app/lib/services/token.service';
import { person } from '@/app/resources';
import { EmailTemplateType } from '@/app/templates/email';
import {
  CreateUserRequestDTO,
  createUserSchema,
  mapUserToResponse,
  TokenType,
  UpdateUserDTO,
} from '@/app/types';
import { userRepo } from '@/lib/repositories/user.repo';
import { sendEmail } from '../server/mail/emailService';
import { dbConnect } from '../server/mongoose';

export const userService = {
  async getAll() {
    await dbConnect();

    const users = await userRepo.findAll();
    return users.map(mapUserToResponse);
  },

  async getById(id: string) {
    await dbConnect();

    const user = await userRepo.findById(id);
    if (!user) {
      throw new NotFoundError('Користувача не знайдено');
    }

    return mapUserToResponse(user);
  },

  async createValidated(payload: unknown) {
    await dbConnect();

    const data: CreateUserRequestDTO = await createUserSchema.validate(
      payload,
      {
        abortEarly: false,
      }
    );

    return userService.create(data);
  },

  async create(data: CreateUserRequestDTO) {
    const plainPassword = data.password ?? generatePassword(12);
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    const user = await userRepo.create({
      ...data,
      password: passwordHash,
      isActive: false,
    });

    const verificationToken = await tokenService.create({
      userId: user._id.toString(),
      type: TokenType.VERIFICATION,
      meta: { plainPassword },
    });

    return {
      user,
      verificationToken: verificationToken.token,
      plainPassword,
    };
  },

  async createWithNotifications(payload: unknown) {
    const { user, verificationToken } = await this.createValidated(payload);

    await this.sendVerificationEmail({
      email: user.email,
      name: user.name,
      verificationToken,
    }).catch(console.error);

    await this.sendUserCreatedAdminNotification({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    }).catch(console.error);

    return mapUserToResponse(user);
  },

  async verifyEmail(tokenValue: string) {
    await dbConnect();

    const verificationToken = await tokenService.verify(
      tokenValue,
      TokenType.VERIFICATION
    );

    const user = await userRepo.findById(verificationToken.userId.toString());
    if (!user) {
      throw new NotFoundError('Користувача не знайдено');
    }

    user.isActive = true;
    await user.save();

    const plainPassword = verificationToken.meta?.plainPassword;
    if (!plainPassword) {
      throw new ValidationError('Пароль недоступний. Спробуйте відновлення.');
    }

    await tokenService.markUsed(verificationToken);

    return {
      user: mapUserToResponse(user),
      plainPassword,
    };
  },

  async activateAccountById(userId: string) {
    await dbConnect();

    const user = await userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('Користувача не знайдено');
    }

    user.isActive = true;
    await user.save();

    return mapUserToResponse(user);
  },

  async changeEmailById(userId: string, newEmail: string) {
    await dbConnect();

    const normalizedEmail = newEmail.trim().toLowerCase();

    const user = await userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('Користувача не знайдено');
    }

    if (normalizedEmail !== user.email) {
      const exists = await userRepo.findByEmail(normalizedEmail);
      if (exists) {
        throw new ValidationError('Email вже використовується');
      }
    }

    user.email = normalizedEmail;
    await user.save();

    return mapUserToResponse(user);
  },

  async update(id: string, data: UpdateUserDTO) {
    await dbConnect();

    const user = await userRepo.findById(id);
    if (!user) {
      throw new NotFoundError('Користувача не знайдено');
    }

    if (data.email) {
      data.email = data.email.trim().toLowerCase();
    }

    if (data.phone) {
      data.phone = data.phone.trim();
    }

    if (data.name) {
      data.name = data.name.trim();
    }

    if (data.email && data.email !== user.email) {
      const exists = await userRepo.findByEmail(data.email);
      if (exists) {
        throw new ValidationError('Email вже використовується');
      }
    }

    if (data.password) {
      const hash = await bcrypt.hash(data.password, 10);
      user.password = hash;
      delete data.password;
    }

    Object.assign(user, data);
    await user.save();

    return mapUserToResponse(user);
  },

  async delete(id: string) {
    await dbConnect();

    const deleted = await userRepo.delete(id);
    if (!deleted) {
      throw new NotFoundError('Користувача не знайдено');
    }

    return mapUserToResponse(deleted);
  },

  async sendVerificationEmail({
    email,
    name,
    verificationToken,
  }: {
    email: string;
    name: string;
    verificationToken: string;
  }) {
    return sendEmail({
      to: email,
      type: EmailTemplateType.VERIFICATION,
      props: {
        name,
        verificationUrl: `${baseUrl}${routes.public.auth.verifyEmail}/?token=${verificationToken}&email=${email}`,
      },
    });
  },

  async resendVerificationEmail(email: string) {
    await dbConnect();

    const normalizedEmail = email.trim().toLowerCase();

    const user = await userRepo.findByEmail(normalizedEmail);

    if (!user) {
      throw new NotFoundError('Користувача не знайдено');
    }

    if (user.isActive) {
      throw new ValidationError('Акаунт вже активовано');
    }

    const verificationToken = await tokenService.create({
      userId: user._id.toString(),
      email: user.email,
      type: TokenType.VERIFICATION,
    });

    await this.sendVerificationEmail({
      email: user.email,
      name: user.name,
      verificationToken: verificationToken.token,
    }).catch(console.error);
  },

  async sendUserCreatedAdminNotification({
    name,
    email,
    role,
    phone,
  }: {
    name: string;
    email: string;
    role: string;
    phone: string;
  }) {
    return sendEmail({
      to: person.email,
      type: EmailTemplateType.USER_CREATED,
      props: {
        name,
        email,
        role,
        phone,
      },
    });
  },
};

import { Types } from 'mongoose';

import { clientRepo } from '@/app/lib/repositories';
import { caseRepo } from '@/app/lib/repositories/case.repo';
import { ValidationError } from '@/app/lib/server/errors/httpErrors';
import { dbConnect } from '@/app/lib/server/mongoose';
import {
  AdminClientCaseDto,
  CreateCaseDTO,
  mapCaseRowToAdminDto,
  UpdateCaseDTO,
} from '@/app/types';

const assertObjectId = (value: string, label: string) => {
  if (!value || value === 'undefined' || !Types.ObjectId.isValid(value)) {
    throw new ValidationError(`Невірний ${label}`);
  }
};

export const caseAdminService = {
  async getByClientId(clientId: string): Promise<AdminClientCaseDto[]> {
    await dbConnect();
    assertObjectId(clientId, 'id клієнта');

    const client = await clientRepo.findById(clientId);
    if (!client) {
      throw new ValidationError('Клієнта не знайдено');
    }

    const rows = await caseRepo.findByClientId(clientId);
    return rows.map(mapCaseRowToAdminDto);
  },

  async createForClient(
    clientId: string,
    data: CreateCaseDTO
  ): Promise<AdminClientCaseDto> {
    await dbConnect();
    assertObjectId(clientId, 'id клієнта');

    const client = await clientRepo.findById(clientId);
    if (!client) {
      throw new ValidationError('Клієнта не знайдено');
    }

    const created = await caseRepo.create({
      clientId,
      title: data.title,
      description: data.description ?? '',
      status: data.status ?? 'new',
      currentStage: data.currentStage ?? 'Первинний аналіз',
      sourceLeadId: data.sourceLeadId ?? null,
      assignedLawyerId: data.assignedLawyerId ?? null,
    });

    const row = await caseRepo.findById(created._id.toString());
    if (!row) {
      throw new ValidationError('Справу не вдалося створити');
    }

    return mapCaseRowToAdminDto({
      _id: row._id,
      clientId: row.clientId,
      title: row.title,
      description: row.description,
      status: row.status,
      currentStage: row.currentStage,
      assignedLawyerId: row.assignedLawyerId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  },

  async update(
    caseId: string,
    data: UpdateCaseDTO
  ): Promise<AdminClientCaseDto> {
    await dbConnect();
    assertObjectId(caseId, 'id справи');

    const updated = await caseRepo.updateById(caseId, data);
    if (!updated) {
      throw new ValidationError('Справу не знайдено');
    }

    return mapCaseRowToAdminDto({
      _id: updated._id,
      clientId: updated.clientId,
      title: updated.title,
      description: updated.description,
      status: updated.status,
      currentStage: updated.currentStage,
      assignedLawyerId: updated.assignedLawyerId,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  },

  async delete(caseId: string): Promise<{ id: string }> {
    await dbConnect();
    assertObjectId(caseId, 'id справи');

    const deleted = await caseRepo.deleteById(caseId);
    if (!deleted) {
      throw new ValidationError('Справу не знайдено');
    }

    return { id: deleted._id.toString() };
  },
};

import { accountActivatedTemplate } from './accountActivated/accountActivatedTemplate';
import { activateUserAccountAccessTemplate } from './activateUserAccount/ActivateUserAccountTemplate';
import { createUserNotificationTemplate } from './createUserNotification/createUserNotificationTemplate';
import { emailChangeTemplate } from './emailChange/emailChangeTemplate';
import { leadAdminTemplate } from './lead/leadAdminTemplate';
import { leadClientTemplate } from './lead/leadClientTemplate';
import { resetPasswordTemplate } from './restore-password/restorePassword';
import { reviewAdminTemplate } from './reviewAdminNotification/reviewAdminTemplate';
import { subscriberAdminTemplate } from './subscriber/subscriberAdminTemplate';
import { subscriberClientTemplate } from './subscriber/subscriberClientTemplate';
import { EmailTemplatePropsMap, EmailTemplateType } from './types';
import { verificationTemplate } from './verification/verificationTemplate';

type TemplateRenderer<T extends EmailTemplateType> = (
  props: EmailTemplatePropsMap[T]
) => string;

const templateMap: {
  [K in EmailTemplateType]: TemplateRenderer<K>;
} = {
  [EmailTemplateType.LEAD_CLIENT]: leadClientTemplate,
  [EmailTemplateType.LEAD_ADMIN]: leadAdminTemplate,

  [EmailTemplateType.SUBSCRIBER_CLIENT]: subscriberClientTemplate,
  [EmailTemplateType.SUBSCRIBER_ADMIN]: subscriberAdminTemplate,

  [EmailTemplateType.VERIFICATION]: verificationTemplate,
  [EmailTemplateType.USER_CREATED]: createUserNotificationTemplate,

  [EmailTemplateType.ACCOUNT_ACTIVATED]: accountActivatedTemplate,

  [EmailTemplateType.ACTIVATE_USER_ACCOUNT]: activateUserAccountAccessTemplate,

  [EmailTemplateType.EMAIL_CHANGE]: emailChangeTemplate,
  [EmailTemplateType.RESET_PASSWORD]: resetPasswordTemplate,

  [EmailTemplateType.REVIEW_ADMIN]: reviewAdminTemplate,
};

export function renderEmailTemplate<T extends EmailTemplateType>(
  type: T,
  props: EmailTemplatePropsMap[T]
): string {
  const renderer = templateMap[type];

  if (!renderer) {
    throw new Error(`Email template "${type}" not registered`);
  }

  return renderer(props);
}

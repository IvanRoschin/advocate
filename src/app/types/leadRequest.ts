import type { LeadInput } from '@/app/models/Lead';

export interface LeadRequestBody extends LeadInput {
  website?: string; // honeypot
  recaptchaToken?: string; // captcha
}

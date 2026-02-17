export interface MailTemplate<TPayload = unknown> {
  subject(payload: TPayload): string;
  html(payload: TPayload): string;
}

export interface SendTemplatedMailOptions<TPayload> {
  to: string;
  payload: TPayload;
  template: MailTemplate<TPayload>;
  from?: {
    email: string;
    name: string;
  };
}

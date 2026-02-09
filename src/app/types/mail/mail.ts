export interface VerificationMailPayload {
  name: string;
  verifyUrl: string;
}

export interface EmailChangePayload {
  verifyUrl: string;
}

export interface CredentialsPayload {
  name: string;
  login: string;
  password: string;
  resetPasswordUrl: string;
}

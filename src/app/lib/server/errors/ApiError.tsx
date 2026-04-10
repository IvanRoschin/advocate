export class ApiError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = new.target.name;
    this.status = status;
    this.code = code;
  }
}

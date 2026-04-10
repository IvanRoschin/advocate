import { ApiError } from './ApiError';

export class ValidationError extends ApiError {
  details?: unknown;

  constructor(message = 'Validation failed', details?: unknown) {
    super(message, 422, 'VALIDATION_ERROR');
    this.details = details;
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Conflict', code = 'CONFLICT') {
    super(message, 409, code);
  }
}

export class NotImplementedError extends ApiError {
  constructor(message = 'Not implemented') {
    super(message, 501, 'NOT_IMPLEMENTED');
  }
}
export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

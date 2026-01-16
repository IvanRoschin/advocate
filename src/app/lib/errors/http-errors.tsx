import { ApiError } from './api-error';

export class ValidationError extends ApiError {
  constructor(
    message = 'Validation failed',
    public details?: unknown
  ) {
    super(message, 422, 'VALIDATION_ERROR');
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

export class NotImplementedError extends ApiError {
  constructor(message = 'Not implemented') {
    super(message, 501, 'NOT_IMPLEMENTED');
  }
}

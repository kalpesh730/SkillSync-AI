import { HTTP_STATUS, MESSAGES } from '../constants/index.js';

export class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation Error', errors = []) {
    super(message, HTTP_STATUS.BAD_REQUEST);
    this.errors = errors;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = MESSAGES.UNAUTHORIZED) {
    super(message, HTTP_STATUS.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = MESSAGES.FORBIDDEN) {
    super(message, HTTP_STATUS.FORBIDDEN);
  }
}

export class NotFoundError extends AppError {
  constructor(message = MESSAGES.NOT_FOUND) {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists.') {
    super(message, HTTP_STATUS.CONFLICT);
  }
}

export class InternalServerError extends AppError {
  constructor(message = MESSAGES.ERROR) {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, false);
  }
}

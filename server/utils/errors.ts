export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class ExternalApiError extends AppError {
  constructor(message = 'External API error') {
    super(message, 502);
    this.name = 'ExternalApiError';
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation error') {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

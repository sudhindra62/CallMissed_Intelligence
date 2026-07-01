export class AppError extends Error {
  public statusCode: number;
  public details?: any;

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ApiError extends AppError {
  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message, statusCode, details);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, details);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Rate limit exceeded. Please try again later.") {
    super(message, 429);
  }
}

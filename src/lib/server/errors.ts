export class AppError extends Error {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Rate limit exceeded. Please try again later.", details?: any) {
    super(message, 429, details);
  }
}

export class ApiError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 500, details);
  }
}

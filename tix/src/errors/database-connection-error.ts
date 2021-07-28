import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  issue = 'Database connection error';
  constructor() {
    super('Unable to connect to database');

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  standardizeErrors() {
    return [{ message: this.issue }];
  }
}

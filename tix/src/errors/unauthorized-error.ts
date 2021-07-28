import { CustomError } from './custom-error';

export class UnAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super('Unauthorized access');

    Object.setPrototypeOf(this, UnAuthorizedError.prototype);
  }

  standardizeErrors() {
    return [{ message: '401 - Unauthorized: Access denied' }];
  }
}

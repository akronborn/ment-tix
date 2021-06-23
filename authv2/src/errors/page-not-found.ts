import { CustomError } from './custom-error';

export class PageNotFound extends CustomError {
  statusCode = 404;

  constructor() {
    super('404: The request page could not be found');

    Object.setPrototypeOf(this, PageNotFound.prototype);
  }

  standardizeErrors() {
    return [{ message: 'Not Found' }];
  }
}

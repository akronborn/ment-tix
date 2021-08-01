import { CustomError } from './custom-error';

export class PageNotFound extends CustomError {
  statusCode = 404;

  constructor() {
    super('404: The requested page could not be found');

    Object.setPrototypeOf(this, PageNotFound.prototype);
  }

  standardizeErrors() {
    return [{ message: 'Page Not Found' }];
  }
}

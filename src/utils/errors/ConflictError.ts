import { HttpException, HttpStatus } from '@nestjs/common';

export default class ConflictError extends HttpException {
  constructor(message?: string) {
    if (!message) message = 'Informações invalidas';
    super(message, HttpStatus.CONFLICT);
  }
}

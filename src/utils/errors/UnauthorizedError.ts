import { HttpException, HttpStatus } from '@nestjs/common';

export default class UnauthorizedError extends HttpException {
  constructor(message?: string) {
    super(message, HttpStatus.UNAUTHORIZED);
    if (!message) message = 'Acesso invalido.';
  }
}

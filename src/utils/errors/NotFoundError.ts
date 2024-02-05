import { HttpException, HttpStatus } from '@nestjs/common';

export default class BadRequestError extends HttpException {
  constructor(message?: string) {
    if (!message) message = 'Solicitação Inválida';
    super(message, HttpStatus.BAD_REQUEST);
  }
}

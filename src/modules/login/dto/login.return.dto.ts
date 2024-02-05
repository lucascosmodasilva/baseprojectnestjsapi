import { ApiProperty } from '@nestjs/swagger';

export class LoginReturnDto {
  @ApiProperty({
    description: 'Token que será utilizado na autenticação.',
    example: '303203f3-9e17-4da6-8e5f-7cff7ed9edc3',
  })
  token: string;
}

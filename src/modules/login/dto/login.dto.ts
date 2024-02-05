import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Login do usuário.',
    example: 'admin',
  })
  login: string;

  @ApiProperty({
    description: 'Senha do usuário.',
    example: '!@#$%A$!#%AdSA',
  })
  password: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { UserTypeEnum } from 'src/enums/user.type.enum';
import { TokenEntity } from 'src/modules/token/entities/token.entity';
import { EntityDefault } from 'src/utils/entity.default';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('users')
export class UserEntity extends EntityDefault {
  @Column({
    type: 'enum',
    enum: UserTypeEnum,
  })
  @ApiProperty({
    description: 'Tipo do usuário.',
    example: Object.keys(UserTypeEnum).join(' | '),
  })
  type: UserTypeEnum;

  @Column({ type: 'text' })
  @ApiProperty({
    description: 'Login do usuário.',
    example: 'user',
  })
  username: string;

  @Column({ type: 'text' })
  @ApiProperty({
    description: 'Senha do usuário.',
    example: '#s@2$g-5',
  })
  password: string;

  @Column({ type: 'text' })
  @ApiProperty({
    description: 'Nome completo do usuário.',
    example: 'User da silva',
  })
  name: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    description: 'Email do usuário.',
    example: 'user@user.com',
    required: false,
  })
  email: string;

  @Column({ type: 'text' })
  @ApiProperty({
    description: 'Cpf do usuário.',
    example: '11111111111',
  })
  document: string;

  @OneToMany(() => TokenEntity, (token) => token.user)
  tokens: TokenEntity[];
}

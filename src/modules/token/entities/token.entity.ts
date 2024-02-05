import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { EntityDefault } from 'src/utils/entity.default';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('tokens')
export class TokenEntity extends EntityDefault {
  @Column({ type: 'text' })
  @ApiProperty({
    description: 'Token utilizado para acessar a aplicação.',
    example: '0bf0e7c7bd28496998656465dfac7c16',
  })
  token: string;

  @Column({ type: 'timestamptz' })
  @ApiProperty({
    description: 'Data de expiração do token.',
    example: '0bf0e7c7bd28496998656465dfac7c16',
  })
  expireIn: Date;

  @Column()
  @ApiProperty({
    description: 'Identificador unico do usuário dono do token.',
    example: '0bf0e7c7bd28496998656465dfac7c16',
  })
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.tokens)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'boolean', nullable: true })
  @ApiProperty({
    description: 'Indica se foi um login feito pelo app.',
    example: false,
  })
  isAppLogin?: boolean;
}

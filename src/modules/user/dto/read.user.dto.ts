import { PartialType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';
import { Exclude } from 'class-transformer';

export class ReadUserDto extends PartialType(UserEntity) {
  @Exclude()
  password?: string;

  @Exclude()
  removedAt?: Date;
}

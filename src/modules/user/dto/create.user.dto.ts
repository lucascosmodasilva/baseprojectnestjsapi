import { OmitType, PartialType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class CreateUserDto extends PartialType(
  OmitType(UserEntity, ['id', 'createdAt', 'updatedAt', 'removedAt']),
) {}

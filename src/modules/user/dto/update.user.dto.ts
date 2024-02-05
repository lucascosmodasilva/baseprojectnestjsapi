import { OmitType, PartialType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(
  OmitType(UserEntity, ['createdAt', 'updatedAt', 'removedAt', 'id']),
) {}

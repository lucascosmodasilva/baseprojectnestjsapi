import { OmitType, PartialType } from '@nestjs/swagger';
import { TokenEntity } from '../entities/token.entity';

export class ReadTokenDto extends PartialType(
  OmitType(TokenEntity, ['removedAt']),
) {}

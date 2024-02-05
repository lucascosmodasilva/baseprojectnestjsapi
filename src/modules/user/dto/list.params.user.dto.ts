import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ListParamsDto } from 'src/utils/auxs/list.params.dto';

export class ListParamsUserDto extends PartialType(ListParamsDto) {
  @ApiProperty({
    description:
      'Busca os termos no usuario pelos campos username, name, email',
    example: 'user',
    required: false,
  })
  search?: string;
}

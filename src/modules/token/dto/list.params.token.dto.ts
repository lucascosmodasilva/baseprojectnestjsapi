import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ListParamsDto } from 'src/utils/auxs/list.params.dto';

export class ListParamsTokenDto extends PartialType(ListParamsDto) {
  @ApiProperty({
    description: 'Busca os termos no usuario pelos campos token.',
    example: 'd52502ee133f4b12-94073eed279c20d8',
    required: false,
  })
  search?: string;
}

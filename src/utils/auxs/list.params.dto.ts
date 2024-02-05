import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class ListParamsDto {
  @ApiProperty({
    description: 'Quantos itens deseja trazer na listagem',
    example: 10,
    required: false,
  })
  take?: number;

  @ApiProperty({
    description: 'Quantos itens deseja pular na listagem',
    example: 20,
    required: false,
  })
  skip?: number;

  @ApiProperty({
    description: 'Coluna que deseja ordenar a listagem',
    example: JSON.stringify({ description: 'DESC | ASC' }),
    required: false,
  })
  order?: string;

  @Exclude()
  userIdInternal?: number;

  static inicializeParans(params: ListParamsDto): ListParamsDto {
    if (!params) params = {};
    if (params.skip === null || params.skip === undefined) params.skip = 0;
    if (params.take === null || params.take === undefined) params.take = 30;
    if (!params.order) params.order = JSON.stringify({ id: 'DESC' });

    return params;
  }
}

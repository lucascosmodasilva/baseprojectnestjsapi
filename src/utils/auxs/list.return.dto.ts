import { ApiProperty } from '@nestjs/swagger';

export default class ListReturnDto<T> {
  @ApiProperty({
    description: 'Lista de itens do objeto.',
    example: JSON.stringify([
      { description: 'Item 1' },
      { description: 'Item 2' },
    ]),
  })
  itens: T[];

  @ApiProperty({
    description: 'Quantidade de itens que existe cadastrado.',
    example: 100,
  })
  count: number;
}

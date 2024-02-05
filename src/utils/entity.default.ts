import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class EntityDefault {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'Identificador unico do usuário',
    example: 1,
  })
  id: number;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Data de criação',
  })
  createdAt: Date;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Data de atualização',
  })
  updatedAt: Date;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  @ApiProperty({
    description: 'Data de remoção',
  })
  removedAt?: Date;
}

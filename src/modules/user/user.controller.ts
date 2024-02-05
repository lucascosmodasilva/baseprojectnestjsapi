import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create.user.dto';
import { ReadUserDto } from './dto/read.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import ListReturnDto from 'src/utils/auxs/list.return.dto';
import { ListParamsUserDto } from './dto/list.params.user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleAdminGuard } from 'src/guards/role.admin.guard';

@Controller('user')
@ApiTags('Usuários')
@UseGuards(RoleAdminGuard)
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  @ApiOkResponse({
    type: ListReturnDto<ReadUserDto>,
  })
  @ApiOperation({ summary: 'Lista os usuários cadastrados.' })
  async list(
    @Query() parans?: ListParamsUserDto,
  ): Promise<ListReturnDto<ReadUserDto>> {
    return this.service.list(parans);
  }

  @Get(':id')
  @ApiOkResponse({
    type: ReadUserDto,
  })
  @ApiOperation({ summary: 'Consulta um usuário pelo identificador unico.' })
  async find(@Param('id') id: number): Promise<ReadUserDto> {
    return await this.service.find(id);
  }

  @Put()
  @ApiOkResponse({
    type: ReadUserDto,
  })
  @ApiOperation({ summary: 'Cria um usuário.' })
  async create(@Body() data: CreateUserDto): Promise<ReadUserDto> {
    return await this.service.create(data);
  }

  @Patch(':id')
  @ApiOkResponse({
    type: ReadUserDto,
  })
  @ApiOperation({ summary: 'Atualiza um usuário pelo identificador unico.' })
  async update(
    @Param('id') id: number,
    @Body() data: UpdateUserDto,
  ): Promise<ReadUserDto> {
    return await this.service.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um usuário pelo identificador unico.' })
  async delete(@Param('id') id: number): Promise<void> {
    await this.service.delete(id);
  }
}

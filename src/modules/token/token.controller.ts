import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TokenService } from './token.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import ListReturnDto from 'src/utils/auxs/list.return.dto';
import { ReadTokenDto } from './dto/read.token.dto';
import { ListParamsTokenDto } from './dto/list.params.token.dto';

@ApiTags('Tokens')
@Controller('token')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class TokenController {
  constructor(private readonly service: TokenService) {}

  @Get()
  @ApiOkResponse({
    type: ListReturnDto<ReadTokenDto>,
  })
  @ApiOperation({ summary: 'Lista os tokens cadastrados.' })
  async list(
    @Query() parans?: ListParamsTokenDto,
  ): Promise<ListReturnDto<ReadTokenDto>> {
    return this.service.list(parans);
  }

  @Get(':id')
  @ApiOkResponse({
    type: ReadTokenDto,
  })
  @ApiOperation({ summary: 'Consulta um token pelo identificador unico.' })
  async find(@Param('id') id: number): Promise<ReadTokenDto> {
    return await this.service.find(id);
  }

  @Put()
  @ApiOkResponse({
    type: ReadTokenDto,
  })
  @ApiOperation({ summary: 'Cria um token.' })
  async create(@Req() req, @Body('days') days?: number): Promise<ReadTokenDto> {
    return await this.service.create(req.sysparameters.user.id, days);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um token pelo identificador unico.' })
  async delete(@Param('id') id: number): Promise<void> {
    await this.service.delete(id);
  }
}

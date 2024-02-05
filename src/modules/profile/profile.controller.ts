import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ReadUserDto } from '../user/dto/read.user.dto';
import { objectToView } from 'src/utils/func.utils';
import { UserEntity } from '../user/entities/user.entity';
import Cripto from 'src/utils/cripto';

@Controller('profile')
@UseGuards(AuthGuard)
@ApiTags('Perfil')
@ApiBearerAuth()
export class ProfileController {
  @Get()
  @ApiOkResponse({
    type: ReadUserDto,
  })
  @ApiOperation({ summary: 'traz dados do perfil' })
  async get(@Req() req): Promise<ReadUserDto> {
    const user: UserEntity = req.sysparameters.user;
    if (user) user.password = null;
    user.document = await Cripto.decript(user.document);

    return objectToView(ReadUserDto, req.sysparameters.user);
  }
}

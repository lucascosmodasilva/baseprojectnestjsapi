import { Post, Controller, Body } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LoginService } from './login.service';
import { LoginReturnDto } from './dto/login.return.dto';

@Controller('login')
@ApiTags('Login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('')
  @ApiOkResponse({
    type: LoginReturnDto,
  })
  @ApiOperation({ summary: 'Faz login do usuário.' })
  async update(@Body() data: LoginDto): Promise<LoginReturnDto> {
    return await this.loginService.login(data);
  }
}

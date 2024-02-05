import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from '../token/entities/token.entity';
import { Injectable } from '@nestjs/common';
import { Equal, IsNull, Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from '../user/entities/user.entity';
import Cripto from 'src/utils/cripto';
import { LoginReturnDto } from './dto/login.return.dto';
import UnauthorizedError from 'src/utils/errors/UnauthorizedError';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(TokenEntity)
    private tokenRepository: Repository<TokenEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async login(data: LoginDto): Promise<LoginReturnDto> {
    if (!data || !data.login || !data.password)
      throw new UnauthorizedError('Usuário ou senha invalidos.');

    const passCript = await Cripto.cript(data.password);
    const user = await this.userRepository.findOne({
      where: {
        username: Equal(data.login),
        password: Equal(passCript),
      },
    });

    if (!user) throw new UnauthorizedError('Usuário ou senha invalidos.');

    const days = 7;
    const expireIn = new Date(new Date().getTime() + days * 8.64e7);

    const tokens = await this.tokenRepository.find({
      where: {
        userId: user.id,
        removedAt: IsNull(),
        isAppLogin: true,
      },
    });

    if (tokens && tokens.length > 0) {
      for (const token of tokens) {
        await this.tokenRepository.update(
          { userId: token.userId },
          { removedAt: new Date() },
        );
      }
    }

    const item = await this.tokenRepository.save({
      token: uuidv4(),
      expireIn,
      userId: user.id,
      isAppLogin: true,
    });

    return {
      token: item.token,
    } as LoginReturnDto;
  }
}

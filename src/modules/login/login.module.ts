import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity } from '../token/entities/token.entity';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TokenEntity]),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}

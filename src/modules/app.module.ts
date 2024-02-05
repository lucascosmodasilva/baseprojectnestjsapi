import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from './token/token.module';
import OrmFactory from 'src/utils/orm.config';
import { LoginModule } from './login/login.module';
import { ProfileModule } from './profile/profile.module';
import { SeedFactoryService } from 'src/factories/seed-factory.service';
import { UserEntity } from './user/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot(OrmFactory),
    TypeOrmModule.forFeature([UserEntity]),
    UserModule,
    TokenModule,
    LoginModule,
    ProfileModule,
  ],
  providers: [SeedFactoryService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly seedFactoryService: SeedFactoryService) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seedFactoryService.seed();
  }
}

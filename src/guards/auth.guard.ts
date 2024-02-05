import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { DataSource, DataSourceOptions, Equal, IsNull } from 'typeorm';
import OrmFactory from 'src/utils/orm.config';
import UnauthorizedError from 'src/utils/errors/UnauthorizedError';
import { TokenEntity } from 'src/modules/token/entities/token.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserTypeEnum } from 'src/enums/user.type.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const dataSource = new DataSource(OrmFactory as DataSourceOptions);
    await dataSource.initialize();
    const tokenRepository = dataSource.getRepository(TokenEntity);
    const userRepository = dataSource.getRepository(UserEntity);

    if (!request || !request.headers) throw new UnauthorizedError();
    let token: string = request.headers.authorization;
    if (!token) token = request.headers.Authorization;

    if (!token) throw new UnauthorizedError();
    token = token.replace('Bearer', '').replace('bearer', '').replace(' ', '');

    const tokenFinded = await tokenRepository.findOne({
      where: {
        token: Equal(token),
        removedAt: IsNull(),
      },
    });

    if (!tokenFinded) throw new UnauthorizedError();
    if (tokenFinded.expireIn.getTime() < new Date().getTime())
      throw new UnauthorizedError('Token expirado.');

    const userFinded = await userRepository.findOne({
      where: {
        id: Equal(tokenFinded.userId),
      },
    });

    if (!userFinded) throw new UnauthorizedError();
    if (!request.sysparameters) request.sysparameters = {};
    request.sysparameters.token = tokenFinded;
    request.sysparameters.user = userFinded;

    if (userFinded.type !== UserTypeEnum.ADMIN)
      request.query.userIdInternal = userFinded.id;

    request.sysparameters.isAdmin = userFinded.type === UserTypeEnum.ADMIN;
    return true;
  }
}

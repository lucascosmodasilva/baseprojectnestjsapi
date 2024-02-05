import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserTypeEnum } from 'src/enums/user.type.enum';
import UnauthorizedError from 'src/utils/errors/UnauthorizedError';

@Injectable()
export class RoleAdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request || !request.sysparameters || !request.sysparameters.user)
      throw new UnauthorizedError();

    if (request.sysparameters.user.type !== UserTypeEnum.ADMIN)
      throw new UnauthorizedError();

    return true;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTypeEnum } from 'src/enums/user.type.enum';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import Cripto from 'src/utils/cripto';
import { Repository } from 'typeorm';

@Injectable()
export class SeedFactoryService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  async seed(): Promise<void> {
    const userFinded = await this.repository.findOne({
      where: {
        username: 'admin',
      },
    });

    if (!userFinded) {
      await this.repository.save({
        name: 'Administrador',
        username: 'admin',
        document: await Cripto.cript('43910523854'),
        password: await Cripto.cript('LCS@123456789'),
        email: 'lucascosmodasilva@gmail.com',
        type: UserTypeEnum.ADMIN,
      });
    }
  }
}

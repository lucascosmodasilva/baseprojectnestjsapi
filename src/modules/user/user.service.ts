import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Equal,
  FindOptionsWhere,
  IsNull,
  ILike,
  Not,
  Repository,
} from 'typeorm';
import { UserEntity } from './entities/user.entity';
import ConflictError from 'src/utils/errors/ConflictError';
import { CreateUserDto } from './dto/create.user.dto';
import { ReadUserDto } from './dto/read.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import NotFountError from 'src/utils/errors/NotFoundError';
import { ListParamsUserDto } from './dto/list.params.user.dto';
import { ListParamsDto } from 'src/utils/auxs/list.params.dto';
import ListReturnDto from 'src/utils/auxs/list.return.dto';
import Cripto from 'src/utils/cripto';
import { objectArrayToView, objectToView } from 'src/utils/func.utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  async list(params: ListParamsUserDto): Promise<ListReturnDto<ReadUserDto>> {
    params = ListParamsDto.inicializeParans(params);
    const orderObj = JSON.parse(params.order);
    let where: FindOptionsWhere<UserEntity>[] | FindOptionsWhere<UserEntity> =
      null;
    if (params.search) {
      where = [
        {
          username: ILike(`%${params.search}%`),
          removedAt: IsNull(),
        } as FindOptionsWhere<UserEntity>,
        {
          name: ILike(`%${params.search}%`),
          removedAt: IsNull(),
        } as FindOptionsWhere<UserEntity>,
        {
          email: ILike(`%${params.search}%`),
          removedAt: IsNull(),
        } as FindOptionsWhere<UserEntity>,
      ];
    } else {
      where = { removedAt: IsNull() } as FindOptionsWhere<UserEntity>;
    }

    const [result, total] = await this.repository.findAndCount({
      order: orderObj,
      take: params.take,
      skip: params.skip,
      where: where,
    });

    return {
      itens: objectArrayToView(
        ReadUserDto,
        await Cripto.decriptFields<UserEntity[]>(result, [
          'password',
          'document',
        ]),
      ),
      count: total,
    } as ListReturnDto<ReadUserDto>;
  }

  async find(id: number): Promise<ReadUserDto> {
    let item = await this.repository.findOne({
      where: {
        id: Equal(id),
      },
    });

    if (!item || item.removedAt) throw new NotFountError();

    item = await Cripto.decriptFields<UserEntity>(item, [
      'password',
      'document',
    ]);
    return objectToView(ReadUserDto, item);
  }

  async create(data: CreateUserDto): Promise<ReadUserDto> {
    await this.validateCreateUser(data);
    data.document = data.document.replaceAll('.', '').replace('-', '');
    data = await Cripto.encriptFields<CreateUserDto>(data, [
      'password',
      'document',
    ]);
    const item = await this.repository.save(data);
    return objectToView(
      ReadUserDto,
      await Cripto.decriptFields<ReadUserDto>(item, ['password', 'document']),
    );
  }

  async update(id: number, data: UpdateUserDto): Promise<ReadUserDto> {
    const itemFinded = await this.repository.findOne({
      where: {
        id: Equal(id),
      },
    });
    if (!data.password)
      data.password = await Cripto.decript(itemFinded.password);

    await this.validateCreateUser(data, id);
    data = await Cripto.encriptFields<UpdateUserDto>(data, [
      'password',
      'document',
    ]);
    await this.repository.update({ id: Equal(Number(id)) }, data);
    return objectToView(ReadUserDto, await this.find(Number(id)));
  }

  async delete(id: number): Promise<void> {
    await this.find(id);
    await this.repository.update({ id }, { removedAt: new Date() });
  }

  async validateCreateUser(data: any, id?: number): Promise<boolean> {
    if (!data)
      throw new ConflictError('Usuário não contem informções validas.');

    if (!data.username) throw new ConflictError('Login não pode ser vazio.');

    if (!data.password) throw new ConflictError('Senha não pode ser vazio.');

    if (!data.document)
      throw new ConflictError('Documento não pode ser vazio.');
    if (!data.name)
      throw new ConflictError('Nome do usuário não pode ser vazio.');

    if (!data.type) throw new ConflictError('Tipo não pode ser vazio.');

    const whereUsername = {
      username: Equal(data.username),
      removedAt: IsNull(),
    };

    if (id) whereUsername['id'] = Not(Number(id));
    const userWithSameUsername = await this.repository.findOne({
      where: whereUsername,
    });

    if (userWithSameUsername)
      throw new ConflictError('Já existe um usuário com mesmo login.');

    const whereDocument = {
      document: Equal(await Cripto.cript(data.document)),
      removedAt: IsNull(),
    };

    if (id) whereDocument['id'] = Not(Number(id));
    const userWithSameDocument = await this.repository.findOne({
      where: whereDocument,
    });

    if (userWithSameDocument)
      throw new ConflictError('Já existe um usuário com mesmo cpf.');

    return true;
  }
}

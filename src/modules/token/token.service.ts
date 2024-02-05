import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from './entities/token.entity';
import { Equal, FindOptionsWhere, ILike, IsNull, Repository } from 'typeorm';
import { ListParamsTokenDto } from './dto/list.params.token.dto';
import ListReturnDto from 'src/utils/auxs/list.return.dto';
import { ReadTokenDto } from './dto/read.token.dto';
import { ListParamsDto } from 'src/utils/auxs/list.params.dto';
import NotFountError from 'src/utils/errors/NotFoundError';
import { v4 as uuidv4 } from 'uuid';
import { objectArrayToView, objectToView } from 'src/utils/func.utils';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private repository: Repository<TokenEntity>,
  ) {}

  async list(params: ListParamsTokenDto): Promise<ListReturnDto<ReadTokenDto>> {
    params = ListParamsDto.inicializeParans(params);
    const orderObj = JSON.parse(params.order);
    let where: FindOptionsWhere<TokenEntity>[] | FindOptionsWhere<TokenEntity> =
      null;
    if (params.search) {
      where = [
        {
          token: ILike(`%${params.search}%`),
          removedAt: IsNull(),
        } as FindOptionsWhere<TokenEntity>,
      ];
    } else {
      where = { removedAt: IsNull() } as FindOptionsWhere<TokenEntity>;
    }

    if (params.userIdInternal) {
      if (Array.isArray(where)) {
        where.forEach((condit) => {
          condit.userId = Equal(params.userIdInternal);
        });
      } else {
        where.userId = Equal(params.userIdInternal);
      }
    }

    const [result, total] = await this.repository.findAndCount({
      order: orderObj,
      take: params.take,
      skip: params.skip,
      where: where,
      relations: ['user'],
    });

    return {
      itens: objectArrayToView(ReadTokenDto, result),
      count: total,
    } as ListReturnDto<ReadTokenDto>;
  }

  async find(id: number): Promise<ReadTokenDto> {
    const item = await this.repository.findOne({
      where: {
        id: Equal(id),
      },
    });

    if (!item || item.removedAt) throw new NotFountError();

    return objectToView(ReadTokenDto, item);
  }

  async create(userId: number, days?: number): Promise<ReadTokenDto> {
    if (!days) days = 30;

    const expireIn = new Date(new Date().getTime() + days * 8.64e7);

    const item = await this.repository.save({
      token: uuidv4(),
      expireIn,
      userId,
    });
    return objectToView(ReadTokenDto, item);
  }

  async delete(id: number): Promise<void> {
    await this.find(id);
    await this.repository.update({ id }, { removedAt: new Date() });
  }
}

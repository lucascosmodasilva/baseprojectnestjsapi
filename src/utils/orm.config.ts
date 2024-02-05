import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { DataSourceOptions } from 'typeorm';

config();
const confgs: DataSourceOptions | TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  synchronize: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  schema: process.env.DATABASE_SCHEMA,
  logging: false,
};

export default confgs;

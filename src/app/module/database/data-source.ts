import { config } from 'src/app/shared/module/config-module/config.service';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: config.getString('DATABASE_HOST'),
  port: config.getNumber('DATABASE_PORT'),
  username: config.getString('DATABASE_USERNAME'),
  password: config.getString('DATABASE_PASSWORD'),
  database: config.getString('DATABASE_SCHEMA'),
  migrationsTableName: 'migrations',
  migrations: ['dist/app/modules/database/migrations/*.js'],
  entities: ['dist/**/*.entity.js'],
  synchronize: config.getString('DATABASE_SYNCHRONIZE') === 'true',
  logging: config.getString('DATABASE_LOGGING') === 'true',
  driver: require('mysql2'),
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;

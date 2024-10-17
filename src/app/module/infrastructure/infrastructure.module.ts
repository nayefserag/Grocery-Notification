import { Winston } from './../../../../node_modules/consola/types/consola.d';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/general/user.entity';
import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';
import { AuthRepository } from './repositories/auth/auth.repository';
@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([UserEntity]),
    WinstonModule.forRoot({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.Console({}),
      ],
    }),
  ],
  controllers: [],
  providers: [AuthRepository],
  exports: [AuthRepository],
})
export class InfrastructureModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlowModule } from '../flow/flow.module';
import { ExecutionModule } from '../execution/execution.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env['MONGO_URI'] ?? 'mongodb://localhost:27017',
      database: process.env['MONGO_DB'] ?? 'ZENTRO',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    FlowModule,
    ExecutionModule,
  ],
})
export class AppModule {}

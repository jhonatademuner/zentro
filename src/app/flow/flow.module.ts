import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flow } from './flow.entity';
import { FlowService } from './flow.service';
import { FlowController } from './flow.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Flow])],
  controllers: [FlowController],
  providers: [FlowService],
  exports: [FlowService],
})
export class FlowModule {}

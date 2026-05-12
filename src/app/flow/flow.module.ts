import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CoreModule} from '@core/core.module';
import {Flow} from './flow.entity';
import {ExecutionError} from '../execution-error/execution-error.entity';
import {FlowService} from './flow.service';
import {FlowController} from './flow.controller';

@Module({
	imports: [TypeOrmModule.forFeature([Flow, ExecutionError]), CoreModule],
	controllers: [FlowController],
	providers: [FlowService],
	exports: [FlowService],
})
export class FlowModule {
}

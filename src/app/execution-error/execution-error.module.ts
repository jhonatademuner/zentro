import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ExecutionError} from './execution-error.entity';
import {ExecutionErrorController} from './execution-error.controller';
import {ExecutionErrorService} from './execution-error.service';

@Module({
	imports: [TypeOrmModule.forFeature([ExecutionError])],
	controllers: [ExecutionErrorController],
	providers: [ExecutionErrorService],
	exports: [ExecutionErrorService],
})
export class ExecutionErrorModule {
}

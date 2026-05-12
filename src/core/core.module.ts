import {Module} from '@nestjs/common';
import {HttpModule} from '@nestjs/axios';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ExecutionError} from '@app/execution-error/execution-error.entity';
import {HttpExecutor} from './executors/http.executor';
import {CommandExecutorFactory} from './executors/command-executor.factory';
import {FlowEngine} from './engines/flow.engine';
import {ExpressionEngine} from './engines/expression.engine';
import {ExecutionContextComposer} from './apis/execution-context-composer';

@Module({
	imports: [HttpModule, TypeOrmModule.forFeature([ExecutionError])],
	providers: [
		HttpExecutor,
		CommandExecutorFactory,
		FlowEngine,
		ExpressionEngine,
		ExecutionContextComposer,
	],
	exports: [
		HttpExecutor,
		CommandExecutorFactory,
		FlowEngine,
		ExpressionEngine,
		ExecutionContextComposer,
	],
})
export class CoreModule {
}
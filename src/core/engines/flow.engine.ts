import {Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {MongoRepository} from 'typeorm';
import {Flow, StepConfig} from '@app/flow/flow.entity';
import {Command} from '../enums/command.enum';
import {
	ExecutionError,
	StepExecutionError,
	StepExecutionErrorStatus,
} from '@app/execution-error/execution-error.entity';
import {UpstreamHttpError} from '../executors/http.executor';
import {ExpressionEngine} from './expression.engine';
import {ExecutionContext} from './execution-context';
import {CommandExecutorFactory} from '../executors/command-executor.factory';
import {ExecutionContextComposer} from '../apis/execution-context-composer';

@Injectable()
export class FlowEngine {
	private readonly logger = new Logger(FlowEngine.name);

	constructor(
		private readonly expressionEngine: ExpressionEngine,
		private readonly executorFactory: CommandExecutorFactory,
		private readonly contextComposer: ExecutionContextComposer,
		@InjectRepository(ExecutionError)
		private readonly executionErrorRepository: MongoRepository<ExecutionError>,
	) {
	}

	async execute(
		flow: Flow,
		executionError: ExecutionError,
	): Promise<ExecutionError> {
		this.logger.log(`Starting flow execution: ${flow.name}`);

		executionError.startedAt = new Date();

		const stepExecutions = new Map<string, StepExecutionError>();

		for (const [stepId, stepConfig] of Object.entries(flow.steps)) {
			const stepExecution = new StepExecutionError();
			stepExecution.stepId = stepId;
			stepExecution.status = StepExecutionErrorStatus.PENDING;
			stepExecutions.set(stepId, stepExecution);
			executionError.steps.push(stepExecution);
		}

		const context = new ExecutionContext(executionError.input);

		for (const [stepId, stepConfig] of Object.entries(flow.steps)) {
			const stepExecution = stepExecutions.get(stepId)!;
			stepExecution.startedAt = new Date();
			stepExecution.request = {
				method: stepConfig.method,
				url: stepConfig.url,
				headers: stepConfig.headers,
				body: stepConfig.body,
				params: stepConfig.params,
			};

			try {
				const resolvedConfig = this.resolveStepConfig(
					stepConfig,
					context.toObject(),
				);
				const command = stepConfig.command ?? Command.HTTP;
				const executor = this.executorFactory.getExecutor(command);
				const result = await executor.execute(stepId, resolvedConfig);

				stepExecution.response = result;
				stepExecution.status = StepExecutionErrorStatus.COMPLETED;
				stepExecution.completedAt = new Date();

				context.setStepResult(stepId, result.data);
				this.contextComposer.store(context, stepId, result.data);
			} catch (error: any) {
				stepExecution.status = StepExecutionErrorStatus.FAILED;
				stepExecution.error = error.message;
				if (error instanceof UpstreamHttpError) {
					stepExecution.response = {
						status: error.status,
						data: error.data,
						headers: error.headers,
					};
				}
				stepExecution.completedAt = new Date();
				executionError.completedAt = new Date();
				this.logger.error(`Step ${stepId} failed: ${error.message}`);
				break;
			}
		}

		const hasFailedStep = executionError.steps.some(
			(s) => s.status === StepExecutionErrorStatus.FAILED,
		);

		if (hasFailedStep) {
			await this.executionErrorRepository.save(executionError);
		} else {
			executionError.completedAt = new Date();
			executionError.output = flow.resultConfig?.mapping
				? this.expressionEngine.extract(
					flow.resultConfig.mapping,
					context.toObject(),
				)
				: context.steps;
		}

		this.logger.log(
			`Flow execution completed${hasFailedStep ? ' with errors' : ' successfully'}`,
		);

		return executionError;
	}

	private resolveStepConfig(
		stepConfig: StepConfig,
		context: Record<string, any>,
	): Record<string, any> {
		return {
			method: stepConfig.method,
			url: this.expressionEngine.evaluate(stepConfig.url, context),
			headers: this.expressionEngine.evaluateObject(stepConfig.headers, context),
			body: this.expressionEngine.evaluateObject(stepConfig.body, context),
			params: this.expressionEngine.evaluateObject(stepConfig.params, context),
		};
	}
}
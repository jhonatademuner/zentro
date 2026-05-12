import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {MongoRepository} from 'typeorm';
import {Flow} from './flow.entity';
import {ExecutionError, StepExecutionErrorStatus} from '../execution-error/execution-error.entity';
import {CreateFlowDto} from './dto/create-flow.dto';
import {UpdateFlowDto} from './dto/update-flow.dto';
import {FlowEngine} from '@core/engines/flow.engine';

@Injectable()
export class FlowService {
	constructor(
		@InjectRepository(Flow)
		private readonly flowRepository: MongoRepository<Flow>,
		private readonly flowEngine: FlowEngine,
	) {
	}

	async create(dto: CreateFlowDto): Promise<Flow> {
		const flow = this.flowRepository.create(dto);
		return this.flowRepository.save(flow);
	}

	async findAll(): Promise<Flow[]> {
		return this.flowRepository.find();
	}

	async findOne(id: string): Promise<Flow> {
		const flow = await this.flowRepository.findOneBy({
			_id: id,
		});

		if (!flow) {
			throw new NotFoundException(`Flow with id "${id}" not found`);
		}

		return flow;
	}

	async update(id: string, dto: UpdateFlowDto): Promise<Flow> {
		const flow = await this.findOne(id);
		Object.assign(flow, dto);
		return this.flowRepository.save(flow);
	}

	async remove(id: string): Promise<void> {
		const flow = await this.findOne(id);
		await this.flowRepository.remove(flow);
	}

	async execute(id: string, input?: Record<string, any>): Promise<any> {
		const flow = await this.findOne(id);

		const executionError = new ExecutionError();
		executionError.name = flow.name;
		executionError.flowId = flow._id;
		executionError.input = input;
		executionError.steps = [];

		const result = await this.flowEngine.execute(flow, executionError);

		const failedStep = result.steps.find(
			(s) => s.status === StepExecutionErrorStatus.FAILED,
		);

		if (failedStep) {
			throw new HttpException(
				{
					message: 'Flow execution failed',
					executionId: result._id,
					stepId: failedStep.stepId,
					error: failedStep.error,
				},
				HttpStatus.BAD_GATEWAY,
			);
		}

		return result.output;
	}
}

import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {MongoRepository} from 'typeorm';
import {ExecutionError} from './execution-error.entity';

@Injectable()
export class ExecutionErrorService {
	constructor(
		@InjectRepository(ExecutionError)
		private readonly executionErrorRepository: MongoRepository<ExecutionError>,
	) {
	}

	async findAll(): Promise<ExecutionError[]> {
		return this.executionErrorRepository.find();
	}

	async findOne(id: string): Promise<ExecutionError> {
		const executionError = await this.executionErrorRepository.findOneBy({
			_id: id,
		});

		if (!executionError) {
			throw new NotFoundException(`Execution error with id "${id}" not found`);
		}

		return executionError;
	}
}

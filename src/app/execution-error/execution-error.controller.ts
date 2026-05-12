import {Controller, Get, HttpCode, HttpStatus, Param,} from '@nestjs/common';
import {ExecutionErrorService} from './execution-error.service';
import {ExecutionErrorResponseDto} from './dto/execution-error-response.dto';
import {ExecutionErrorMapper} from './execution-error.mapper';

@Controller('/v1/execution-errors')
export class ExecutionErrorController {
	constructor(private readonly executionErrorService: ExecutionErrorService) {
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	async findAll(): Promise<ExecutionErrorResponseDto[]> {
		const executionErrors = await this.executionErrorService.findAll();
		return ExecutionErrorMapper.toResponseList(executionErrors);
	}

	@Get('/:id')
	@HttpCode(HttpStatus.OK)
	async findOne(@Param('id') id: string): Promise<ExecutionErrorResponseDto> {
		const executionError = await this.executionErrorService.findOne(id);
		return ExecutionErrorMapper.toResponse(executionError);
	}
}

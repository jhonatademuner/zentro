import {ExecutionError} from './execution-error.entity';
import {ExecutionErrorResponseDto} from './dto/execution-error-response.dto';

export class ExecutionErrorMapper {
	static toResponse(entity: ExecutionError): ExecutionErrorResponseDto {
		const dto = new ExecutionErrorResponseDto();
		dto.id = entity._id;
		dto.name = entity.name;
		dto.flowId = entity.flowId;
		dto.input = entity.input;
		dto.output = entity.output;
		dto.steps = entity.steps ?? [];
		dto.startedAt = entity.startedAt;
		dto.completedAt = entity.completedAt;
		dto.createdAt = entity.createdAt;
		dto.updatedAt = entity.updatedAt;
		return dto;
	}

	static toResponseList(entities: ExecutionError[]): ExecutionErrorResponseDto[] {
		return entities.map(ExecutionErrorMapper.toResponse);
	}
}

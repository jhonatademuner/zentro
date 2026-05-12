import { Execution } from './execution.entity';
import {
  ExecutionResponseDto
} from './dto/execution-response.dto';

export class ExecutionMapper {
  static toResponse(entity: Execution): ExecutionResponseDto {
    const dto = new ExecutionResponseDto();
    dto.id = entity._id.toHexString();
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }

  static toResponseList(entities: Execution[]): ExecutionResponseDto[] {
    return entities.map(ExecutionMapper.toResponse);
  }
}

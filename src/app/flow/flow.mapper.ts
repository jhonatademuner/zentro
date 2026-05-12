import { Flow, FlowStep, FlowResponseConfig } from './flow.entity';
import {
  FlowResponseDto,
  FlowStepResponseDto,
  FlowResponseConfigResponseDto,
} from './dto/flow-response.dto';

export class FlowMapper {
  static toResponse(entity: Flow): FlowResponseDto {
    const dto = new FlowResponseDto();
    dto.id = entity._id.toHexString();
    dto.name = entity.name;
    dto.type = entity.type;
    dto.steps = entity.steps.map(FlowMapper.stepToResponse);
    dto.responseConfig = entity.responseConfig
      ? FlowMapper.responseConfigToResponse(entity.responseConfig)
      : undefined;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }

  static toResponseList(entities: Flow[]): FlowResponseDto[] {
    return entities.map(FlowMapper.toResponse);
  }

  private static stepToResponse(step: FlowStep): FlowStepResponseDto {
    const dto = new FlowStepResponseDto();
    dto.stepId = step.stepId;
    dto.method = step.method;
    dto.url = step.url;
    if (step.headers) dto.headers = step.headers;
    if (step.body) dto.body = step.body;
    if (step.params) dto.params = step.params;
    if (step.nextSteps) dto.nextSteps = step.nextSteps;
    return dto;
  }

  private static responseConfigToResponse(
    config: FlowResponseConfig,
  ): FlowResponseConfigResponseDto {
    const dto = new FlowResponseConfigResponseDto();
    dto.mapping = config.mapping;
    return dto;
  }
}

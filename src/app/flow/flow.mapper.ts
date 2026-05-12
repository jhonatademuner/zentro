import {Flow, ResultConfig, StepConfig} from './flow.entity';
import {FlowResponseDto, ResultConfigResponseDto, StepConfigResponseDto,} from './dto/flow-response.dto';

export class FlowMapper {
	static toResponse(entity: Flow): FlowResponseDto {
		const dto = new FlowResponseDto();
		dto.id = entity._id;
		dto.name = entity.name;
		dto.type = entity.type;
		dto.steps = Object.fromEntries(
			Object.entries(entity.steps ?? {}).map(([stepId, step]) => [
				stepId,
				FlowMapper.stepToResponse(step),
			]),
		);
		dto.resultConfig = entity.resultConfig
			? FlowMapper.resultConfigToResponse(entity.resultConfig)
			: undefined;
		dto.createdAt = entity.createdAt;
		dto.updatedAt = entity.updatedAt;
		return dto;
	}

	static toResponseList(entities: Flow[]): FlowResponseDto[] {
		return entities.map(FlowMapper.toResponse);
	}

	private static stepToResponse(step: StepConfig): StepConfigResponseDto {
		const dto = new StepConfigResponseDto();
		if (step.command) dto.command = step.command;
		dto.method = step.method;
		dto.url = step.url;
		if (step.headers) dto.headers = step.headers;
		if (step.body) dto.body = step.body;
		if (step.params) dto.params = step.params;
		if (step.nextSteps) dto.nextSteps = step.nextSteps;
		return dto;
	}

	private static resultConfigToResponse(
		config: ResultConfig,
	): ResultConfigResponseDto {
		const dto = new ResultConfigResponseDto();
		dto.mapping = config.mapping;
		return dto;
	}
}
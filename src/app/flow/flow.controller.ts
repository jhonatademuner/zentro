import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import {FlowService} from './flow.service';
import {CreateFlowDto} from './dto/create-flow.dto';
import {UpdateFlowDto} from './dto/update-flow.dto';
import {FlowResponseDto} from './dto/flow-response.dto';
import {FlowMapper} from './flow.mapper';

@Controller("/v1/flows")
export class FlowController {
	constructor(private readonly flowService: FlowService) {
	}

	@Post()
	@HttpCode(HttpStatus.OK)
	async create(@Body() dto: CreateFlowDto): Promise<FlowResponseDto> {
		const flow = await this.flowService.create(dto);
		return FlowMapper.toResponse(flow);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	async findAll(): Promise<FlowResponseDto[]> {
		const flows = await this.flowService.findAll();
		return FlowMapper.toResponseList(flows);
	}

	@Get("/:id")
	@HttpCode(HttpStatus.OK)
	async findOne(@Param("id") id: string): Promise<FlowResponseDto> {
		const flow = await this.flowService.findOne(id);
		return FlowMapper.toResponse(flow);
	}

	@Patch("/:id")
	@HttpCode(HttpStatus.OK)
	async update(
		@Param("id") id: string,
		@Body() dto: UpdateFlowDto,
	): Promise<FlowResponseDto> {
		const flow = await this.flowService.update(id, dto);
		return FlowMapper.toResponse(flow);
	}

	@Delete("/:id")
	@HttpCode(HttpStatus.NO_CONTENT)
	async remove(@Param("id") id: string): Promise<void> {
		return this.flowService.remove(id);
	}

	@Post("/:id/execute")
	@HttpCode(HttpStatus.OK)
	async execute(
		@Param("id") id: string,
		@Body() input?: Record<string, any>,
	): Promise<any> {
		if (input != null && (typeof input !== "object" || Array.isArray(input))) {
			throw new BadRequestException("Input must be an object");
		}
		return this.flowService.execute(id, input);
	}
}

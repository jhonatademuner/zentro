import {
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
import { ExecutionService } from './execution.service';
import { ExecutionResponseDto } from './dto/execution-response.dto';
import { ExecutionMapper } from './execution.mapper';

@Controller('/v1/executions')
export class ExecutionController {
  constructor(private readonly executionService: ExecutionService) {}

  @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<ExecutionResponseDto[]> {
      const executions = await this.executionService.findAll();
      return ExecutionMapper.toResponseList(executions);
    }
  
    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id: string): Promise<ExecutionResponseDto> {
      const execution = await this.executionService.findOne(id);
      return ExecutionMapper.toResponse(execution);
    }

}

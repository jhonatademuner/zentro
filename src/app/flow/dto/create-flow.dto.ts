import {
  IsObject,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  ValidateNested,
  IsString,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FlowType, HttpMethod } from '@core/enums';

export class CreateFlowStepDto {
  @IsString()
  @IsNotEmpty()
  readonly stepId!: string;

  @IsEnum(HttpMethod)
  readonly method!: HttpMethod;

  @IsString()
  @IsNotEmpty()
  readonly url!: string;

  @IsOptional()
  @IsObject()
  readonly headers?: Record<string, string>;

  @IsOptional()
  @IsObject()
  readonly body?: Record<string, any>;

  @IsOptional()
  @IsObject()
  readonly params?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly nextSteps?: string[];
}

export class CreateFlowResponseConfigDto {
  @IsObject()
  readonly mapping!: Record<string, any>;
}

export class CreateFlowDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsEnum(FlowType)
  readonly type!: FlowType;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateFlowStepDto)
  readonly steps!: CreateFlowStepDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateFlowResponseConfigDto)
  readonly responseConfig?: CreateFlowResponseConfigDto;
}

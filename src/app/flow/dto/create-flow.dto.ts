import {
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsObject,
	IsOptional,
	IsString,
	Validate,
	ValidateNested,
	validateSync,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';
import {plainToInstance, Type} from 'class-transformer';
import {Command, FlowType, HttpMethod} from '@core/enums';

export class CreateStepConfigDto {
	@IsEnum(Command)
	@IsOptional()
	readonly command?: Command;

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
	@IsString({each: true})
	readonly nextSteps?: string[];
}

export class CreateResultConfigDto {
	@IsObject()
	readonly mapping!: Record<string, any>;
}

@ValidatorConstraint({name: 'isFlowStepsRecord', async: false})
class FlowStepsRecordConstraint implements ValidatorConstraintInterface {
	validate(value: unknown): boolean {
		if (value == null || typeof value !== 'object' || Array.isArray(value)) {
			return false;
		}

		return Object.values(value).every((step) => {
			const instance = plainToInstance(CreateStepConfigDto, step);
			return validateSync(instance).length === 0;
		});
	}

	defaultMessage(args: ValidationArguments): string {
		return `${args.property} must be an object keyed by step id with valid step definitions`;
	}
}

export class CreateFlowDto {
	@IsString()
	@IsNotEmpty()
	readonly name!: string;

	@IsEnum(FlowType)
	readonly type!: FlowType;

	@IsObject()
	@Validate(FlowStepsRecordConstraint)
	readonly steps!: Record<string, CreateStepConfigDto>;

	@IsOptional()
	@ValidateNested()
	@Type(() => CreateResultConfigDto)
	readonly resultConfig?: CreateResultConfigDto;
}
export class StepConfigResponseDto {
	command?: string;
	method!: string;
	url!: string;
	headers?: Record<string, string>;
	body?: Record<string, any>;
	params?: Record<string, any>;
	nextSteps?: string[];
}

export class ResultConfigResponseDto {
	mapping!: Record<string, any>;
}

export class FlowResponseDto {
	id!: string;
	name!: string;
	type!: string;
	steps!: Record<string, StepConfigResponseDto>;
	resultConfig?: ResultConfigResponseDto;
	createdAt!: Date;
	updatedAt!: Date;
}
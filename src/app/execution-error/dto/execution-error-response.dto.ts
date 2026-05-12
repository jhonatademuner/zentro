export class ExecutionErrorResponseDto {
	id!: string;
	name!: string;
	flowId!: string;
	input?: Record<string, any>;
	output?: Record<string, any>;
	steps!: any[];
	startedAt?: Date;
	completedAt?: Date;
	createdAt!: Date;
	updatedAt!: Date;
}

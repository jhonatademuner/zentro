import {Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn,} from 'typeorm';

export enum StepExecutionErrorStatus {
	PENDING = 'PENDING',
	COMPLETED = 'COMPLETED',
	FAILED = 'FAILED',
}

export class StepExecutionError {
	@Column()
	stepId!: string;

	@Column()
	status!: StepExecutionErrorStatus;

	@Column({nullable: true})
	startedAt?: Date;

	@Column({nullable: true})
	completedAt?: Date;

	@Column({nullable: true})
	request?: Record<string, any>;

	@Column({nullable: true})
	response?: Record<string, any>;

	@Column({nullable: true})
	error?: string;
}

@Entity('execution_errors')
export class ExecutionError {
	@ObjectIdColumn()
	_id!: string;

	@Column()
	name!: string;

	@Column({type: 'string'})
	flowId!: string;

	@Column({nullable: true})
	input?: Record<string, any>;

	@Column({nullable: true})
	output?: Record<string, any>;

	@Column()
	steps!: StepExecutionError[];

	@Column({nullable: true})
	startedAt?: Date;

	@Column({nullable: true})
	completedAt?: Date;

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;
}

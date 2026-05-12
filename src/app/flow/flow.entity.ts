import {Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn,} from 'typeorm';
import {Command, FlowType, HttpMethod} from '@core/enums';

export class StepConfig {
	@Column({nullable: true})
	command?: Command;

	@Column()
	method!: HttpMethod;

	@Column()
	url!: string;

	@Column({nullable: true})
	headers?: Record<string, string>;

	@Column({nullable: true})
	body?: Record<string, any>;

	@Column({nullable: true})
	params?: Record<string, any>;

	@Column({nullable: true})
	nextSteps?: string[];
}

export class ResultConfig {
	@Column()
	mapping!: Record<string, any>;
}

@Entity('flows')
export class Flow {
	@ObjectIdColumn()
	_id!: string;

	@Column()
	name!: string;

	@Column()
	type!: FlowType;

	@Column()
	steps!: Record<string, StepConfig>;

	@Column({nullable: true})
	resultConfig?: ResultConfig;

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;
}
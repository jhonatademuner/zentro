import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectId,
} from 'typeorm';
import { FlowType, HttpMethod } from '@core/enums';

export class FlowStep {
  @Column()
  stepId!: string;

  @Column({ type: 'enum', enum: HttpMethod })
  method!: HttpMethod;

  @Column()
  url!: string;

  @Column({ type: 'json', nullable: true })
  headers?: Record<string, string>;

  @Column({ type: 'json', nullable: true })
  body?: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  params?: Record<string, any>;

  @Column({ type: 'simple-array', nullable: true })
  nextSteps?: string[];
}

export class FlowResponseConfig {
  @Column({ type: 'json' })
  mapping!: Record<string, any>;
}

@Entity('flows')
export class Flow {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  name!: string;

  @Column({ type: 'enum', enum: FlowType })
  type!: FlowType;

  @Column(() => FlowStep)
  steps!: FlowStep[];

  @Column(() => FlowResponseConfig)
  responseConfig!: FlowResponseConfig;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

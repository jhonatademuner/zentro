export class FlowStepResponseDto {
  stepId!: string;
  method!: string;
  url!: string;
  headers?: Record<string, string>;
  body?: Record<string, any>;
  params?: Record<string, any>;
  nextSteps?: string[];
}

export class FlowResponseConfigResponseDto {
  mapping!: Record<string, any>;
}

export class FlowResponseDto {
  id!: string;
  name!: string;
  type!: string;
  steps!: FlowStepResponseDto[];
  responseConfig?: FlowResponseConfigResponseDto;
  createdAt!: Date;
  updatedAt!: Date;
}

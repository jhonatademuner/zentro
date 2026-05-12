export class ExecutionContext {
	readonly input: Record<string, any>;
	readonly steps: Record<string, any>;
	readonly runtime: Record<string, any>;

	constructor(input?: Record<string, any>) {
		this.input = input ?? {};
		this.steps = {};
		this.runtime = {};
	}

	setStepResult(stepId: string, data: any): void {
		this.steps[stepId] = data;
	}

	setRuntimeVar(name: string, value: any): void {
		this.runtime[name] = value;
	}

	toObject(): Record<string, any> {
		return {
			input: this.input,
			steps: this.steps,
			runtime: this.runtime,
		};
	}
}
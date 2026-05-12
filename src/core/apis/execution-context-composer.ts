import {Injectable} from '@nestjs/common';
import {ExecutionContext} from '../engines/execution-context';

@Injectable()
export class ExecutionContextComposer {
	store(
		context: ExecutionContext,
		varName: string,
		value: any,
		options?: { spread?: boolean; overwrite?: boolean },
	): void {
		const spread = options?.spread ?? false;
		const overwrite = options?.overwrite ?? true;

		if (spread && value && typeof value === 'object' && !Array.isArray(value)) {
			for (const [key, val] of Object.entries(value)) {
				if (overwrite || context.runtime[key] === undefined) {
					context.setRuntimeVar(key, val);
				}
			}
		} else {
			if (overwrite || context.runtime[varName] === undefined) {
				context.setRuntimeVar(varName, value);
			}
		}
	}
}
import {Injectable} from '@nestjs/common';
import {DataNavigator} from '@core/apis';
import {DataResolver} from '@core/apis';
import {DataComposer} from '@core/apis';

@Injectable()
export class ExpressionEngine {
	resolve(path: string, context: Record<string, any>): any {
		return DataResolver.resolve(context, path);
	}

	evaluate(expression: string, context: Record<string, any>): string {
		return expression.replace(
			/\{\{\s*([\w.]+)\s*\}\}|\{\s*([\w.]+)\s*\}/g,
			(match, doubleBracePath: string, singleBracePath: string) => {
				const path = doubleBracePath ?? singleBracePath;
				const value = DataNavigator.getAtPath(context, path);
				return value !== undefined ? String(value) : match;
			},
		);
	}

	evaluateObject(
		obj: Record<string, any> | undefined,
		context: Record<string, any>,
	): Record<string, any> | undefined {
		if (!obj) return obj;

		const resolved: Record<string, any> = {};
		for (const [key, value] of Object.entries(obj)) {
			if (typeof value === 'string') {
				resolved[key] = this.evaluate(value, context);
			} else if (typeof value === 'object' && value !== null) {
				resolved[key] = this.evaluateObject(value as Record<string, any>, context);
			} else {
				resolved[key] = value;
			}
		}

		return resolved;
	}

	extract(
		mapping: Record<string, any>,
		context: Record<string, any>,
	): Record<string, any> {
		const output: Record<string, any> = {};

		for (const [key, value] of Object.entries(mapping)) {
			if (typeof value === 'string') {
				DataComposer.set(output, key, DataResolver.resolve(context, value));
			} else if (typeof value === 'object' && value !== null) {
				output[key] = this.extract(value as Record<string, any>, context);
			} else {
				output[key] = value;
			}
		}

		return output;
	}
}
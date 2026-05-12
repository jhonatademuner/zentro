export class DataNavigator {
	static getAtPath(root: Record<string, any>, path: string): any {
		const segments = path.split('.');
		let current: any = root;

		for (const segment of segments) {
			if (current === undefined || current === null) return undefined;
			if (typeof current !== 'object' || Array.isArray(current)) return undefined;
			current = current[segment];
		}

		return current;
	}

	static setAtPath(
		root: Record<string, any>,
		path: string,
		value: any,
	): void {
		const segments = path.split('.');
		let current: any = root;

		for (let i = 0; i < segments.length - 1; i++) {
			const segment = segments[i];
			if (current[segment] === undefined || current[segment] === null) {
				current[segment] = {};
			}
			current = current[segment];
		}

		current[segments[segments.length - 1]] = value;
	}
}
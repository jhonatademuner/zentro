import {DataNavigator} from './data-navigator';

export enum ComposeMode {
	OBJECT = 'OBJECT',
	SPREAD = 'SPREAD',
}

export class DataComposer {
	static set(
		root: Record<string, any>,
		key: string,
		value: any,
		mode: ComposeMode = ComposeMode.OBJECT,
	): void {
		if (key.includes('.')) {
			DataNavigator.setAtPath(root, key, value);
			return;
		}

		switch (mode) {
			case ComposeMode.OBJECT:
				root[key] = value;
				break;
			case ComposeMode.SPREAD:
				if (value && typeof value === 'object' && !Array.isArray(value)) {
					Object.assign(root, value);
				}
				break;
		}
	}
}
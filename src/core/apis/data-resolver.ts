import {DataNavigator} from './data-navigator';

export class DataResolver {
	static resolve(root: Record<string, any>, path: string): any {
		return path.includes('.')
			? DataNavigator.getAtPath(root, path)
			: root[path];
	}
}
import {Injectable} from '@nestjs/common';
import {Command} from '../enums/command.enum';
import {CommandExecutor} from './command-executor.interface';
import {HttpExecutor} from './http.executor';

@Injectable()
export class CommandExecutorFactory {
	private readonly executors: Map<Command, CommandExecutor>;

	constructor(private readonly httpExecutor: HttpExecutor) {
		this.executors = new Map<Command, CommandExecutor>([
			[Command.HTTP, httpExecutor],
		]);
	}

	getExecutor(command: Command): CommandExecutor {
		const executor = this.executors.get(command);
		if (!executor) {
			throw new Error(`No executor registered for command: ${command}`);
		}
		return executor;
	}
}
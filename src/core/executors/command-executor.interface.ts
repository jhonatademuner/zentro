import {Command} from '../enums/command.enum';

export interface CommandResult {
	status: number;
	data: any;
	headers: Record<string, any>;
}

export interface CommandExecutor {
	getCommand(): Command;

	execute(stepId: string, config: Record<string, any>): Promise<CommandResult>;
}
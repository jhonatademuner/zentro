import {Injectable, Logger} from '@nestjs/common';
import {HttpService} from '@nestjs/axios';
import {Command} from '../enums/command.enum';
import {CommandExecutor, CommandResult} from './command-executor.interface';

export class UpstreamHttpError extends Error {
	constructor(
		public readonly status: number,
		public readonly data: any,
		public readonly headers: any,
	) {
		super(`Upstream request failed with status ${status}`);
	}
}

@Injectable()
export class HttpExecutor implements CommandExecutor {
	private readonly logger = new Logger(HttpExecutor.name);

	constructor(private readonly httpService: HttpService) {
	}

	getCommand(): Command {
		return Command.HTTP;
	}

	async execute(
		stepId: string,
		config: Record<string, any>,
	): Promise<CommandResult> {
		this.logger.log(
			`Executing step: ${stepId} - ${config.method} ${config.url}`,
		);

		const requestConfig: Record<string, any> = {
			method: config.method,
			url: config.url,
			headers: config.headers ?? {},
			params: config.params ?? {},
		};

		if (config.body) {
			requestConfig['data'] = config.body;
		}

		try {
			const response = await this.httpService.axiosRef.request(requestConfig);

			return {
				status: response.status,
				data: response.data,
				headers: response.headers,
			};
		} catch (error: any) {
			if (error.response) {
				throw new UpstreamHttpError(
					error.response.status,
					error.response.data,
					error.response.headers,
				);
			}
			throw error;
		}
	}
}
import {Module} from '@nestjs/common';
import {randomUUID} from 'crypto';
import {TypeOrmModule} from '@nestjs/typeorm';
import {HttpModule} from '@nestjs/axios';
import {CoreModule} from '@core/core.module';
import {Flow} from '../flow/flow.entity';
import {ExecutionError} from '../execution-error/execution-error.entity';
import {FlowModule} from '../flow/flow.module';
import {ExecutionErrorModule} from '../execution-error/execution-error.module';

@Module({
	imports: [
		HttpModule,
		CoreModule,
		TypeOrmModule.forRoot({
			type: 'mongodb',
			url: process.env['MONGO_URI'] ?? 'mongodb://localhost:27017',
			database: process.env['MONGO_DB'] ?? 'ZENTRO',
			pkFactory: {
				createPk: () => randomUUID(),
			},
			entities: [Flow, ExecutionError],
			synchronize: process.env['NODE_ENV'] !== 'production',
		}),
		FlowModule,
		ExecutionErrorModule,
	],
})
export class AppModule {
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Execution } from './execution.entity';

@Injectable()
export class ExecutionService {
    constructor(
      @InjectRepository(Execution)
      private readonly executionRepository: MongoRepository<Execution>,
    ) {}
  
    async findAll(): Promise<Execution[]> {
      return this.executionRepository.find();
    }
  
    async findOne(id: string): Promise<Execution> {
      const execution = await this.executionRepository.findOneBy({
        _id: new ObjectId(id) as any,
      });
  
      if (!execution) {
        throw new NotFoundException(`Execution with id "${id}" not found`);
      }
  
      return execution;
    }
}

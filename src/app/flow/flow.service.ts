import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Flow } from './flow.entity';
import { CreateFlowDto } from './dto/create-flow.dto';
import { UpdateFlowDto } from './dto/update-flow.dto';

@Injectable()
export class FlowService {
  constructor(
    @InjectRepository(Flow)
    private readonly flowRepository: MongoRepository<Flow>,
  ) {}

  async create(dto: CreateFlowDto): Promise<Flow> {
    const flow = this.flowRepository.create(dto);
    return this.flowRepository.save(flow);
  }

  async findAll(): Promise<Flow[]> {
    return this.flowRepository.find();
  }

  async findOne(id: string): Promise<Flow> {
    const flow = await this.flowRepository.findOneBy({
      _id: new ObjectId(id) as any,
    });

    if (!flow) {
      throw new NotFoundException(`Flow with id "${id}" not found`);
    }

    return flow;
  }

  async update(id: string, dto: UpdateFlowDto): Promise<Flow> {
    const flow = await this.findOne(id);
    Object.assign(flow, dto);
    return this.flowRepository.save(flow);
  }

  async remove(id: string): Promise<void> {
    const flow = await this.findOne(id);
    await this.flowRepository.remove(flow);
  }
}

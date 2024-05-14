import { Inject, Injectable } from '@nestjs/common';
import { CreateScrapperDto } from './dto/create-scrapper.dto';
import { UpdateScrapperDto } from './dto/update-scrapper.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scrapper, ScrapperStatus } from './entities/scrapper.entity';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ScrapperService {
  constructor(
    @InjectRepository(Scrapper)
    private scrapperRepository: Repository<Scrapper>,
    @Inject('FACTSBOLT_API_SCRAPPER') private client: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async create(id: string): Promise<Scrapper> {
    const scrapperEntity = await this.scrapperRepository.save({
      id,
      status: ScrapperStatus.PENDING,
    });
    console.log(id);
    this.client.emit('scrapperJob', id);
    return scrapperEntity;
  }

  findAll() {
    return `This action returns all scrapper`;
  }

  findOne(id: string) {
    return this.scrapperRepository.findOneBy({ id });
  }

  async update(
    id: string,
    updateScrapperDto: UpdateScrapperDto,
  ): Promise<void> {
    await this.scrapperRepository.update(id, {
      status: updateScrapperDto.status,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} scrapper`;
  }

  async addToScrapperQueue(id: string) {}
}

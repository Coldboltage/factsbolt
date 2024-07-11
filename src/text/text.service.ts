import { Injectable } from '@nestjs/common';
import { CreateTextDto } from './dto/create-text.dto';
import { UpdateTextDto } from './dto/update-text.dto';
import { FullTextJob, TextEntity } from './entities/text.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TextService {
  constructor(
    @InjectRepository(TextEntity)
    private textRepository: Repository<TextEntity>,
  ) {}

  create(createTextDto: CreateTextDto) {
    return 'This action adds a new text';
  }

  findAll() {
    return `This action returns all text`;
  }

  findOne(id: number) {
    return `This action returns a #${id} text`;
  }

  update(id: number, updateTextDto: UpdateTextDto) {
    return `This action updates a #${id} text`;
  }

  remove(id: number) {
    return `This action removes a #${id} text`;
  }

  async saveFullTextJob(textJob: FullTextJob) {
    console.log('saveFullTextJob started');
    const textEntity = this.textRepository.create({
      text: textJob.text.text,
      chatgpt: { ...textJob.chatgpt, created: new Date() },
    });

    console.log('created entity');

    const savedEntity = await this.textRepository.save(textEntity);

    console.log('saved entity');
    console.log(
      await this.textRepository.findOne({
        where: {
          id: savedEntity.id,
        },
      }),
    );
  }
}

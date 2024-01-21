import { Injectable } from '@nestjs/common';
import { CreateScrapperDto } from './dto/create-scrapper.dto';
import { UpdateScrapperDto } from './dto/update-scrapper.dto';

@Injectable()
export class ScrapperService {
  create(createScrapperDto: CreateScrapperDto) {
    return 'This action adds a new scrapper';
  }

  findAll() {
    return `This action returns all scrapper`;
  }

  findOne(id: number) {
    return `This action returns a #${id} scrapper`;
  }

  update(id: number, updateScrapperDto: UpdateScrapperDto) {
    return `This action updates a #${id} scrapper`;
  }

  remove(id: number) {
    return `This action removes a #${id} scrapper`;
  }
}

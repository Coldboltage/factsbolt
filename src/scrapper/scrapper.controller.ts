import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ScrapperService } from './scrapper.service';
import { CreateScrapperDto } from './dto/create-scrapper.dto';
import { UpdateScrapperDto } from './dto/update-scrapper.dto';

@Controller()
export class ScrapperController {
  constructor(private readonly scrapperService: ScrapperService) {}

  @MessagePattern('createScrapper')
  create(@Payload() createScrapperDto: CreateScrapperDto) {
    return this.scrapperService.create(createScrapperDto);
  }

  @MessagePattern('findAllScrapper')
  findAll() {
    return this.scrapperService.findAll();
  }

  @MessagePattern('findOneScrapper')
  findOne(@Payload() id: number) {
    return this.scrapperService.findOne(id);
  }

  @MessagePattern('updateScrapper')
  update(@Payload() updateScrapperDto: UpdateScrapperDto) {
    return this.scrapperService.update(updateScrapperDto.id, updateScrapperDto);
  }

  @MessagePattern('removeScrapper')
  remove(@Payload() id: number) {
    return this.scrapperService.remove(id);
  }
}

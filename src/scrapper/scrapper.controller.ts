import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ScrapperService } from './scrapper.service';
import { CreateScrapperDto } from './dto/create-scrapper.dto';
import { UpdateScrapperDto } from './dto/update-scrapper.dto';

@Controller('scrapper')
export class ScrapperController {
  constructor(private readonly scrapperService: ScrapperService) {}

  @Post(':id')
  create(@Param('id') id: string) {
    return this.scrapperService.create(id);
  }

  @Get()
  findAll() {
    return this.scrapperService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scrapperService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScrapperDto: UpdateScrapperDto,
  ) {
    console.log(updateScrapperDto);
    return this.scrapperService.update(id, updateScrapperDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scrapperService.remove(+id);
  }
}

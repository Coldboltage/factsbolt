import { PartialType } from '@nestjs/mapped-types';
import { CreateScrapperDto } from './create-scrapper.dto';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ScrapperStatus } from '../entities/scrapper.entity';

export class UpdateScrapperDto extends PartialType(CreateScrapperDto) {
  @IsEnum(ScrapperStatus)
  @IsNotEmpty()
  status: ScrapperStatus;
}

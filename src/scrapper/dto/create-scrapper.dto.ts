import { IsNotEmpty, IsString } from 'class-validator';

export class CreateScrapperDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

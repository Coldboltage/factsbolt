import { IsString } from 'class-validator';

export class CheckUrl {
  @IsString()
  url: string;
}

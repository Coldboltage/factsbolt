import { IsString, IsUrl } from 'class-validator';

export class CreateVideoDto {
  @IsString()
  @IsUrl()
  link: string;
}

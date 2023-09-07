import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateVideoDto {
  @IsString()
  @IsUrl()
  link: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  meta: string;
}

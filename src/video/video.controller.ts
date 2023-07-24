import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Video } from './entities/video.entity';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post()
  async create(@Body() createVideoDto: CreateVideoDto): Promise<Video> {
    return this.videoService.create(createVideoDto);
  }

  @Get()
  findAll() {
    return this.videoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(+id, updateVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videoService.remove(+id);
  }

  @Get('find/get-or-generate-video')
  async getOrGenerateVideo(
    @Body() createVideoDto: CreateVideoDto,
  ): Promise<Video> {
    return this.videoService.getOrGenerateVideo(createVideoDto);
  }

  // Message Pattern

  // @MessagePattern('completedJob')
  @EventPattern('completedJob')
  async completedJob(@Payload() data: Video): Promise<string> {
    console.log('Hello World');
    console.log(data);
    const result = await this.videoService.saveFullVideoJob(data);
    return `Hello, World!`;
  }
}

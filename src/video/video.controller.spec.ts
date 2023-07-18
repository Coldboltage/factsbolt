import { Test, TestingModule } from '@nestjs/testing';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { Video } from './entities/video.entity';

describe('VideoController', () => {
  let controller: VideoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoController],
      providers: [
        VideoService,
        {
          provide: 'VideoRepository',
          useValue: createMock<Repository<Video>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get<VideoController>(VideoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

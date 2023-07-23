import { Test, TestingModule } from '@nestjs/testing';
import { VideoService } from './video.service';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm/repository/Repository';
import { Video } from './entities/video.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { ConflictException } from '@nestjs/common';

describe('VideoService', () => {
  let service: VideoService;
  let videoRepository: Repository<Video>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<VideoService>(VideoService);
    videoRepository = module.get<Repository<Video>>('VideoRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getVideoByLink', () => {
    // getVideoByLink aims to get a video via by the link without paramater queries.
    it('Should find a video via link from linkParameter', async () => {
      // Arrange
      const linkId = 'https://youtu.be/KDclmm2iwMY?list=RDKDclmm2iwMY';
      const videoByLink = new Video();
      videoByLink.link = linkId;

      const findOneSpy = jest
        .spyOn(videoRepository, 'findOne')
        .mockResolvedValueOnce(videoByLink);

      // Act
      const result = await service.findVideoByLink(linkId);

      // Asset
      expect(result).toEqual(videoByLink);
      expect(findOneSpy).toBeCalled();
      expect(findOneSpy).toBeCalledWith({ where: { link: linkId } });
    });
    it('Should return null if no video was found via link', async () => {
      // Arrange
      const linkId = 'https://youtu.be/KDclmm2iwMY?list=RDKDclmm2iwMY';

      const findOneSpy = jest
        .spyOn(videoRepository, 'findOne')
        .mockResolvedValueOnce(null);

      // Act
      const result = await service.findVideoByLink(linkId);

      // Assert
      expect(result).toBe(null);
      expect(findOneSpy).toBeCalled();
    });
  });

  describe('create', () => {
    it('Create a Video Record', async () => {
      // Arrange
      const linkId = 'https://youtu.be/KDclmm2iwMY?list=RDKDclmm2iwMY';

      const createVideoDto = new CreateVideoDto();
      createVideoDto.link = linkId;

      const newVideo = new Video();
      newVideo.link = createVideoDto.link;

      const findOneSpy = jest
        .spyOn(service, 'findVideoByLink')
        .mockResolvedValueOnce(null);
      const createOneSpy = jest
        .spyOn(videoRepository, 'save')
        .mockResolvedValueOnce(newVideo);

      // Act
      const result = await service.create(createVideoDto);

      // Asset
      expect(result).toEqual(newVideo);
      expect(findOneSpy).toBeCalledTimes(1);
      expect(createOneSpy).toBeCalledTimes(1);
    });

    it('Should throw an ConflictException if link exists', async () => {
      // Arrange
      const linkId = 'https://youtu.be/KDclmm2iwMY?list=RDKDclmm2iwMY';

      const createVideoDto = new CreateVideoDto();
      createVideoDto.link = linkId;

      const foundVideo = new Video();
      foundVideo.link = createVideoDto.link;

      const findOneSpy = jest
        .spyOn(service, 'findVideoByLink')
        .mockResolvedValueOnce(foundVideo);

      // Act + Assert
      await expect(service.create(createVideoDto)).rejects.toThrow(
        new ConflictException('video_already_exists'),
      );
      expect(findOneSpy).toBeCalled();
    });
  });
});

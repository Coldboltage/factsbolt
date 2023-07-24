import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Video } from './entities/video.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Transcription } from '../transcription/entities/transcription.entity';
import { ChatGPT } from '../chatgpt/entity/chatgpt.entity';

@Injectable()
export class VideoService {
  constructor(
    @Inject('FACTSBOLT_API') private client: ClientProxy,
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    @InjectRepository(Transcription)
    private readonly transcriptRepostiroy: Repository<Transcription>,
    @InjectRepository(ChatGPT)
    private readonly chatgptRepostiroy: Repository<ChatGPT>,
  ) {}
  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async create(createVideoDto: CreateVideoDto): Promise<Video> {
    console.log('Hello Alan');
    // const videoByLink = await this.findVideoByLink(createVideoDto.link);
    // if (videoByLink) throw new ConflictException('video_already_exists');
    // const createVideoFromLink = await this.videoRepository.create(
    //   createVideoDto,
    // );
    const createVideoFromLink = await this.videoRepository.save(createVideoDto);

    console.log(createVideoFromLink);

    // this.client.send('newJob', createVideoDto.link).subscribe({
    //   next: (result) => console.log(result),
    //   error: (error) => console.error(error),
    // });
    this.client.emit('newJob', createVideoDto.link);
    return createVideoFromLink;
  }

  findAll() {
    return `This action returns all video`;
  }

  findOne(id: number) {
    return `This action returns a #${id} video`;
  }

  update(id: number, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${id} video`;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }

  // Video Services
  async findVideoByLink(link: string): Promise<Video> {
    const videoByLink = await this.videoRepository.findOne({ where: { link } });
    if (!videoByLink) return null;
    return videoByLink;
  }

  async saveFullVideoJob(data: any): Promise<Video> {
    const videoEntity = await this.findVideoByLink(data.video.link);

    console.log(videoEntity);

    videoEntity.name = data.video.name;
    videoEntity.website = 'Youtube'; // TODO GRAB FROM URL

    const transciptionEntity = this.transcriptRepostiroy.create({
      assemblyId: data.transcription.assembleyId,
      text: data.transcription.text,
      link: data.transcription.link,
    });

    const chatgptEntity = this.chatgptRepostiroy.create({
      created: new Date(),
      content: data.chatgpt.content,
    });

    const savedTranscriptionEntity = await this.transcriptRepostiroy.save(
      transciptionEntity,
    );

    const savedChatGPTEntity = await this.chatgptRepostiroy.save(chatgptEntity);

    videoEntity.transcription = savedTranscriptionEntity;
    videoEntity.chatgpt = savedChatGPTEntity;

    await this.videoRepository.save(videoEntity);
    return videoEntity;
  }

  async getOrGenerateVideo(createVideoDto: CreateVideoDto): Promise<Video> {
    const videoEntity = await this.findVideoByLink(createVideoDto.link);
    if (!videoEntity) {
      console.log("No video found")
      return this.create(createVideoDto);
    }
    return videoEntity;
  }
}

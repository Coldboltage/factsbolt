import {
  ConflictException,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { FullJob, Video } from './entities/video.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Transcription } from '../transcription/entities/transcription.entity';
import { ChatGPT } from '../chatgpt/entity/chatgpt.entity';
import { TextOnlyDto } from './dto/text-only.dto';

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
    const videoByLink = await this.findVideoByLink(createVideoDto.link);
    if (videoByLink) throw new ConflictException('video_already_exists');

    const videoById = await this.findVideoByOriginId(
      this.checkURL(createVideoDto.link),
    );
    if (videoById) throw new ConflictException('video_already_exists');

    console.log(videoById);

    const createVideoFromLink = this.videoRepository.save({
      ...createVideoDto,
      originId: this.checkURL(createVideoDto.link),
    });

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

  async findVideoByOriginId(originId: string): Promise<Video> {
    const videoByLink = await this.videoRepository.findOne({
      where: { originId },
    });
    if (!videoByLink) return null;
    return videoByLink;
  }

  async saveFullVideoJob(data: FullJob): Promise<Video> {
    const videoEntity = await this.findVideoByLink(data.video.link);

    console.log(videoEntity);

    videoEntity.name = data.video.name;
    videoEntity.website = 'Youtube'; // TODO GRAB FROM URL
    videoEntity.originId = data.video.id;

    const transciptionEntity = this.transcriptRepostiroy.create({
      assemblyId: data.transcription.assembleyId,
      text: data.transcription.text,
      link: data.transcription.link,
    });

    const chatgptEntity = this.chatgptRepostiroy.create({
      created: new Date(),
      content: data.chatgpt.content,
      plainText: data.chatgpt.plainText,
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
      console.log('No video found');
      return this.create(createVideoDto);
    }
    return videoEntity;
  }

  async getOrGenerateText(textOnlyDto: TextOnlyDto) {
    this.client.emit('text-only', textOnlyDto);
  }

  checkURL(url: string): string {
    const youtube = ['youtube', 'youtu.be'];
    const tiktok = ['tiktok'];
    const instagram = ['instagram'];
    let site: string;

    for (const hostname of youtube) {
      if (url.includes(hostname) && !site) site = 'youtube';
    }

    for (const hostname of tiktok) {
      if (url.includes(hostname) && !site) site = 'tiktok';
    }

    for (const hostname of instagram) {
      if (url.includes(hostname) && !site) site = 'instagram';
    }

    let test: string;

    switch (site) {
      case 'youtube':
        test = this.extraxtYoutubeId(url);
        return test;
      case 'tiktok':
        test = this.extractTikTokID(url);
        return test;
      case 'instagram':
        test = this.extractInstagramId(url);
        return test;
      default:
        throw new NotFoundException('website_not_found');
    }
  }

  extractInstagramId(url: string) {
    const regex = /\/p\/([a-zA-Z0-9_-]+)/;
    const instagramId = url.match(regex);
    if (!instagramId)
      throw new NotAcceptableException('id_not_found_or_link_bad_format');
    console.log('Alan we got here you fucking cunt');
    return instagramId[1];
  }

  extractTikTokID(url: string) {
    const regex =
      /\bhttps?:\/\/(?:m|www)\.tiktok\.com\/.*\b(?:(?:usr|v|embed|user|video)\/|\?shareId=)(\d+)\b/;
    const tiktokId = url.match(regex);
    console.log(tiktokId);
    if (!tiktokId)
      throw new NotAcceptableException('id_not_found_or_link_bad_format');
    return tiktokId[1];
  }
  extraxtYoutubeId(url: string) {
    const regex =
      /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
    const youtubeId = url.match(regex);
    if (!youtubeId)
      throw new NotAcceptableException('id_not_found_or_link_bad_format');
    return youtubeId[1];
  }
}

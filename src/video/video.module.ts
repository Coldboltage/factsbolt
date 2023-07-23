import { Module, forwardRef } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TranscriptionModule } from '../transcription/transcription.module';
import { Transcription } from '../transcription/entities/transcription.entity';
import { ChatGPT } from '../chatgpt/entity/chatgpt.entity';

@Module({
  imports: [
    forwardRef(() => TranscriptionModule),
    ClientsModule.register([
      {
        name: 'FACTSBOLT_API',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'video_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    TypeOrmModule.forFeature([Video, Transcription, ChatGPT]),
  ],
  controllers: [VideoController],
  providers: [VideoService],
  exports: [VideoService, ClientsModule],
})
export class VideoModule {}

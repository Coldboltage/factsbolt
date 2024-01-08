import { Module, forwardRef } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TranscriptionModule } from '../transcription/transcription.module';
import { Transcription } from '../transcription/entities/transcription.entity';
import { ChatGPT } from '../chatgpt/entity/chatgpt.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    forwardRef(() => TranscriptionModule),
    ClientsModule.registerAsync([
      {
        name: 'FACTSBOLT_API',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              `amqp://${configService.get<string>('RABBITMQ_BASEURL')}:5672`,
            ],
            queue: 'video_queue',
            queueOptions: {
              durable: false,
            },
            socketOptions: {
              heartbeatIntervalInSeconds: 60, // Heartbeat interval in seconds
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    TypeOrmModule.forFeature([Video, Transcription, ChatGPT]),
  ],
  controllers: [VideoController],
  providers: [VideoService],
  exports: [VideoService, ClientsModule],
})
export class VideoModule {}

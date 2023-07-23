import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideoModule } from './video/video.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioModule } from './audio/audio.module';
import { TranscriptionModule } from './transcription/transcription.module';
import { Transcription } from './transcription/entities/transcription.entity';
import { Video } from './video/entities/video.entity';
import { Audio } from './audio/entities/audio.entity';
import { ChatgptModule } from './chatgpt/chatgpt.module';
import { ChatGPT } from './chatgpt/entity/chatgpt.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TYPEORM_HOST,
      port: +process.env.TYPEORM_PORT,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [Video, Audio, Transcription, ChatGPT],
      synchronize: true,
      logging: false,
    }),
    VideoModule,
    AudioModule,
    TranscriptionModule,
    ChatgptModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

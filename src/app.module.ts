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
import { ConfigModule } from '@nestjs/config';
import { ScrapperModule } from './scrapper/scrapper.module';
import { Scrapper } from './scrapper/entities/scrapper.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.local',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TYPEORM_HOST,
      port: +process.env.TYPEORM_PORT,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [Video, Audio, Transcription, ChatGPT, Scrapper],
      synchronize: true,
      logging: false,
    }),
    VideoModule,
    AudioModule,
    TranscriptionModule,
    ChatgptModule,
    ScrapperModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

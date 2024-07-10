import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { VideoModule } from './video/video.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioModule } from './audio/audio.module';
import { TranscriptionModule } from './transcription/transcription.module';
import { Transcription } from './transcription/entities/transcription.entity';
import { Video } from './video/entities/video.entity';
import { Audio } from './audio/entities/audio.entity';
import { ChatgptModule } from './chatgpt/chatgpt.module';
import { ChatGPT } from './chatgpt/entity/chatgpt.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScrapperModule } from './scrapper/scrapper.module';
import { Scrapper } from './scrapper/entities/scrapper.entity';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.local',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        console.log(configService.get<string>('TYPEORM_HOST'));
        return {
          type: 'postgres',
          host: configService.get<string>('TYPEORM_HOST'),
          port: configService.get<number>('TYPEORM_PORT'),
          username: configService.get<string>('TYPEORM_USERNAME'),
          password: configService.get<string>('TYPEORM_PASSWORD'),
          database: configService.get<string>('TYPEORM_DATABASE'),
          entities: [Video, Audio, Transcription, ChatGPT, Scrapper],
          synchronize: true,
          logging: false,
        };
      },

      inject: [ConfigService],
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

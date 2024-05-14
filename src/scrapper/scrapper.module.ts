import { Module } from '@nestjs/common';
import { ScrapperService } from './scrapper.service';
import { ScrapperController } from './scrapper.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scrapper } from './entities/scrapper.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'FACTSBOLT_API_SCRAPPER',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              // `amqp://${configService.get<string>('RABBITMQ_BASEURL')}:5672`,
              `amqp://${configService.get<string>('RABBITMQ_BASEURL')}:5672`,
            ],
            queue: 'scrapper-queue',
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
    TypeOrmModule.forFeature([Scrapper]),
  ],
  controllers: [ScrapperController],
  providers: [ScrapperService],
})
export class ScrapperModule {}

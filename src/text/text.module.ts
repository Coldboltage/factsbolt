import { Module } from '@nestjs/common';
import { TextService } from './text.service';
import { TextController } from './text.controller';
import { TextEntity } from './entities/text.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TextEntity])],
  controllers: [TextController],
  providers: [TextService],
})
export class TextModule {}

import { Module, forwardRef } from '@nestjs/common';
import { TranscriptionService } from './transcription.service';
import { TranscriptionController } from './transcription.controller';
import { VideoModule } from '../video/video.module';

@Module({
  imports: [forwardRef(() => VideoModule)],
  controllers: [TranscriptionController],
  providers: [TranscriptionService],
})
export class TranscriptionModule {}

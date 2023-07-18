import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Video } from '../../video/entities/video.entity';
import { Transcription } from '../../transcription/entities/transcription.entity';

@Entity()
export class Audio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  processed: boolean;

  @OneToOne(() => Video)
  video: Video;

  @OneToOne(() => Transcription)
  transcription: Transcription;
}

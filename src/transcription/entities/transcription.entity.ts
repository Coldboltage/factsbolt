import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Video } from '../../video/entities/video.entity';
import { Audio } from '../../audio/entities/audio.entity';

@Entity()
export class Transcription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  assemblyId: string;

  @Column()
  text: string;

  @OneToOne(() => Audio)
  audio: Audio;

  @OneToOne(() => Video)
  video: Video;
}

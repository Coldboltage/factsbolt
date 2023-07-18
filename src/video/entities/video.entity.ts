import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Audio } from '../../audio/entities/audio.entity';
import { Transcription } from '../../transcription/entities/transcription.entity';

@Entity()
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  link: string;

  @Column()
  website: string;

  @OneToOne(() => Audio)
  @JoinColumn()
  audio: Audio;

  @OneToOne(() => Transcription)
  @JoinColumn()
  transcription: Transcription;
}

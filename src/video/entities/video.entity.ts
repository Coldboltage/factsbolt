import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Audio } from '../../audio/entities/audio.entity';
import { Transcription } from '../../transcription/entities/transcription.entity';
import { ChatGPT } from '../../chatgpt/entity/chatgpt.entity';

@Entity()
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name?: string;

  @Column()
  link: string;

  @Column({ nullable: true })
  website?: string;

  @OneToOne(() => Audio)
  @JoinColumn()
  audio: Audio;

  @OneToOne(() => Transcription)
  @JoinColumn()
  transcription: Transcription;

  @OneToOne(() => ChatGPT, {eager: true})
  @JoinColumn()
  chatgpt: ChatGPT;
}

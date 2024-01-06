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
// import { ChatGPT } from '../../chatgpt/entity/chatgpt.entity';
// import { JobStatus } from 'factsbolt-types';

// Extracted from Factsbolt Job
export interface AudioInformation {
  url: string;
  filename: string;
  folder: string;
  quality: string;
}

export interface VideoJob {
  id?: string;
  name?: string;
  link: string;
  website?: string;
}

export interface AudioJob {
  id?: string;
  processed: boolean;
  transcription?: TranscriptionJob;
}

export interface TranscriptionJob {
  id?: string;
  assembleyId: string;
  link: string;
  text: string;
}

export interface FullJob {
  video: VideoJob;
  transcription: TranscriptionJob;
  chatgpt: ChatGPT;
}

export interface CompletedVideoJob {
  video: VideoJob;
  audio: AudioInformation;
}

export interface Content {
  role: string;
  content: string;
}

export interface Utterance {
  speech: Speech[];
}

export interface AmendedUtterance {
  speech: AmendedSpeech[];
}

export interface Speech {
  confidence: number;
  end: number;
  speaker: string;
  text: string;
  words: Words[];
}

export interface AmendedSpeech {
  speaker: string;
  text: string;
}

export interface Words {
  text: string;
  start: number;
  end: number;
  confidence: number;
  speaker: string;
}

export enum JobStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

@Entity()
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name?: string;

  @Column()
  link: string;

  @Column({ nullable: true })
  originId: string;

  @Column({ nullable: true })
  website?: string;

  @OneToOne(() => Audio)
  @JoinColumn()
  audio: Audio;

  @OneToOne(() => Transcription)
  @JoinColumn()
  transcription: Transcription;

  @OneToOne(() => ChatGPT, { eager: true })
  @JoinColumn()
  chatgpt: ChatGPT;

  @Column({ nullable: true })
  meta: string;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.IN_PROGRESS,
  })
  status: JobStatus;
}

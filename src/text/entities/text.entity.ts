import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatGPT } from '../../chatgpt/entity/chatgpt.entity';

export interface TextJob {
  id?: string;
  text: string;
}

export class FullTextJob {
  text: TextJob;
  chatgpt: ChatGPT;
}

@Entity()
export class TextEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @OneToOne(() => ChatGPT, { eager: true, cascade: true })
  @JoinColumn()
  chatgpt: ChatGPT;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ChatGPT {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  created: Date;

  @Column({ type: 'simple-array' })
  content: Content;

  @Column({ nullable: true })
  plainText: string;
}

export interface Content {
  role: string;
  content: string;
}

import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum ScrapperStatus {
  PENDING = 'PENDING',
  READY = 'READY',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

@Entity()
export class Scrapper {
  @PrimaryColumn()
  id: string;

  @Column()
  status: ScrapperStatus;
}

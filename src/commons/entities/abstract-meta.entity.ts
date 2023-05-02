import { AbstractEntity } from './abstract.entity';
import { Column } from 'typeorm';

export class AbstractEntityWithMeta extends AbstractEntity {
  @Column({ type: 'json', nullable: true })
  meta: string;
}

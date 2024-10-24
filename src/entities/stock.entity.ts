import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BeforeInsert,
  BaseEntity,
} from 'typeorm';
import { ICadrartStock } from '@manuszep/cadrart2025-common';

import { CadrartArticle } from './article.entity';

@Entity('stock')
export class CadrartStock extends BaseEntity implements ICadrartStock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  articleName?: string;

  @ManyToOne(() => CadrartArticle, { nullable: true })
  article?: CadrartArticle;

  @Column({ type: 'date', nullable: true })
  orderDate?: Date;

  @Column({ type: 'date', nullable: true })
  deliveryDate?: Date;

  @BeforeInsert()
  private setCreateDate(): void {
    this.createdAt = new Date();
  }
}

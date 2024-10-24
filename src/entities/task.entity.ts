import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { ICadrartTask } from '@manuszep/cadrart2025-common';

import { ColumnNumericTransformer } from '../utils';

import { CadrartArticle } from './article.entity';
import { CadrartJob } from './job.entity';

@Entity('task')
export class CadrartTask extends BaseEntity implements ICadrartTask {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => CadrartJob, (job: CadrartJob) => job.tasks, {
    onDelete: 'CASCADE',
  })
  job!: CadrartJob;

  @ManyToOne(() => CadrartArticle, (article: CadrartArticle) => article.tasks)
  article!: CadrartArticle;

  @Column({ type: 'varchar', length: 255, nullable: true })
  comment?: string;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  total!: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  totalBeforeReduction!: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  totalWithVat!: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  image?: string;

  @OneToMany(() => CadrartTask, (task: CadrartTask) => task.parent, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  children?: CadrartTask[];

  @ManyToOne(() => CadrartTask, (task: CadrartTask) => task.children, {
    nullable: true,
  })
  parent?: CadrartTask;

  @Column({ type: 'smallint', default: 0 })
  doneCount!: number;
}
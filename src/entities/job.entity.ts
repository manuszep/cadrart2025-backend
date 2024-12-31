import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';
import {
  ECadrartJobMeasureType,
  ECadrartJobOrientation,
  ICadrartJob,
  ICadrartLocation
} from '@manuszep/cadrart2025-common';

import { ColumnDateTransformer, ColumnNumericTransformer } from '../utils';

import { CadrartTask } from './task.entity';
import { CadrartOffer } from './offer.entity';

@Entity('job')
export class CadrartJob extends BaseEntity implements ICadrartJob {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => CadrartOffer, (offer: CadrartOffer) => offer.jobs, {
    onDelete: 'CASCADE'
  })
  offer!: CadrartOffer;

  @Column({ type: 'smallint', default: 1 })
  count!: number;

  @Column({
    type: 'enum',
    enum: ECadrartJobOrientation,
    default: ECadrartJobOrientation.VERTICAL
  })
  orientation!: ECadrartJobOrientation;

  @Column({
    type: 'enum',
    enum: ECadrartJobMeasureType,
    default: ECadrartJobMeasureType.MEASURE_GLASS
  })
  measure!: ECadrartJobMeasureType;

  @Column({ type: 'json', nullable: true })
  location?: ICadrartLocation;

  @Column({
    type: 'date',
    nullable: true,
    transformer: new ColumnDateTransformer()
  })
  dueDate?: Date;

  @Column({
    type: 'date',
    nullable: true,
    transformer: new ColumnDateTransformer()
  })
  startDate?: Date;

  @Column({
    type: 'decimal',
    precision: 7,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer()
  })
  openingWidth!: number;

  @Column({
    type: 'decimal',
    precision: 7,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer()
  })
  openingHeight!: number;

  @Column({
    type: 'decimal',
    precision: 7,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer()
  })
  marginWidth!: number;

  @Column({
    type: 'decimal',
    precision: 7,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer()
  })
  marginHeight!: number;

  @Column({
    type: 'decimal',
    precision: 7,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer()
  })
  glassWidth!: number;

  @Column({
    type: 'decimal',
    precision: 7,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer()
  })
  glassHeight!: number;

  @OneToMany(() => CadrartTask, (task: CadrartTask) => task.job, {
    cascade: true,
    nullable: true
  })
  tasks?: CadrartTask[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  image?: string;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer()
  })
  total!: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer()
  })
  totalBeforeReduction!: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer()
  })
  totalWithVat!: number;

  @BeforeInsert()
  handleBeforeInsert(): void {
    // Remove tasks that don't have articles

    if (this.tasks) {
      this.tasks = this.tasks.filter((task: CadrartTask) => task.article !== null);
    }
  }

  @BeforeUpdate()
  handleBeforeUpdate(): void {
    // Remove tasks that don't have articles

    if (this.tasks) {
      this.tasks = this.tasks.filter((task: CadrartTask) => task.article !== null);
    }
  }
}

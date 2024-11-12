import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BeforeInsert, BaseEntity } from 'typeorm';
import { ECadrartOfferStatus, ICadrartOffer } from '@manuszep/cadrart2025-common';

import { ColumnNumericTransformer } from '../utils';

import { CadrartTeamMember } from './team-member.entity';
import { CadrartClient } from './client.entity';
import { CadrartJob } from './job.entity';

@Entity('offer')
export class CadrartOffer extends BaseEntity implements ICadrartOffer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt: Date;

  @Column({ type: 'varchar', length: 50 })
  number!: string;

  @Column({ type: 'json' })
  client?: CadrartClient;

  @Column({ type: 'json', nullable: true })
  assignedTo?: CadrartTeamMember;

  @Column({
    type: 'enum',
    enum: ECadrartOfferStatus,
    default: ECadrartOfferStatus.STATUS_CREATED
  })
  status!: ECadrartOfferStatus;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer()
  })
  adjustedReduction?: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer()
  })
  adjustedVat?: number;

  @OneToMany(() => CadrartJob, (job: CadrartJob) => job.offer, {
    cascade: true
  })
  jobs!: CadrartJob[];

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
    this.createdAt = new Date();
  }
}

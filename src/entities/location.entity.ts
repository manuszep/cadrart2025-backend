import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { ICadrartLocation } from '@manuszep/cadrart2025-common';

import { CadrartJob } from './job.entity';

@Entity('location')
export class CadrartLocation extends BaseEntity implements ICadrartLocation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @OneToMany(() => CadrartJob, (job: CadrartJob) => job.location, {
    nullable: true,
  })
  jobs?: CadrartJob[];
}

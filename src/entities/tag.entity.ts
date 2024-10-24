import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { ICadrartTag } from '@manuszep/cadrart2025-common';

import { CadrartClient } from './client.entity';

@Entity('tag')
export class CadrartTag extends BaseEntity implements ICadrartTag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @OneToMany(() => CadrartClient, (client: CadrartClient) => client.tag, {
    nullable: true,
  })
  clients!: CadrartClient[];
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { ICadrartClient } from '@manuszep/cadrart2025-common';

import { ColumnNumericTransformer } from '../utils';

import { CadrartTag } from './tag.entity';
import { CadrartOffer } from './offer.entity';

@Entity('client')
export class CadrartClient extends BaseEntity implements ICadrartClient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50 })
  lastName!: string;

  @Column({ type: 'varchar', length: 50 })
  firstName!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  company?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  mail?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone2?: string;

  @Column({ type: 'smallint', default: 21 })
  vat?: number;

  @ManyToOne(() => CadrartTag, (tag: CadrartTag) => tag.clients, {
    nullable: true,
  })
  tag?: CadrartTag;

  @OneToMany(() => CadrartOffer, (offer: CadrartOffer) => offer.client, {
    nullable: true,
  })
  offers?: CadrartOffer[];

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  reduction!: number;
}

import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { ICadrartFormula } from '@manuszep/cadrart2025-common';

@Entity('formula')
export class CadrartFormula extends BaseEntity implements ICadrartFormula {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  formula!: string;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import {
  ECadrartArticlePriceMethod,
  ECadrartArticleFamily,
  ICadrartArticle,
} from '@manuszep/cadrart2025-common';

import { ColumnNumericTransformer } from '../utils';

import { CadrartFormula } from './formula.entity';
import { CadrartProvider } from './provider.entity';
import { CadrartTask } from './task.entity';

@Entity('article')
export class CadrartArticle extends BaseEntity implements ICadrartArticle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  place?: string;

  @Column({
    type: 'decimal',
    precision: 7,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  buyPrice?: number;

  @Column({
    type: 'decimal',
    precision: 7,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  sellPrice?: number;

  @Column({
    type: 'enum',
    enum: ECadrartArticlePriceMethod,
    default: ECadrartArticlePriceMethod.BY_LENGTH,
  })
  getPriceMethod!: ECadrartArticlePriceMethod;

  @Column({
    type: 'enum',
    enum: ECadrartArticleFamily,
    default: ECadrartArticleFamily.ASSEMBLY,
  })
  family!: ECadrartArticleFamily;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 100,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  maxReduction?: number;

  @ManyToOne(
    () => CadrartProvider,
    (provider: CadrartProvider) => provider.articles,
    {
      nullable: true,
    },
  )
  provider?: CadrartProvider;

  @ManyToOne(() => CadrartFormula, { nullable: true })
  formula?: CadrartFormula;

  @Column({ type: 'varchar', length: 50, nullable: true })
  providerRef?: string;

  @Column({
    type: 'decimal',
    precision: 7,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  maxLength?: number;

  @Column({
    type: 'decimal',
    precision: 7,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  maxWidth?: number;

  @Column({ type: 'boolean', default: false })
  combine!: boolean;

  @OneToMany(() => CadrartTask, (task: CadrartTask) => task.article, {
    nullable: true,
  })
  tasks?: CadrartTask[];
}

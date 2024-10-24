import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { ICadrartProvider } from '@manuszep/cadrart2025-common';

import { CadrartArticle } from './article.entity';

@Entity('provider')
export class CadrartProvider extends BaseEntity implements ICadrartProvider {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 25, nullable: true })
  vat?: string;

  @Column({ type: 'varchar', length: 34, nullable: true })
  iban?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  mail?: string;

  @OneToMany(
    () => CadrartArticle,
    (article: CadrartArticle) => article.provider,
    {
      nullable: true,
    },
  )
  articles?: CadrartArticle[];
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  BaseEntity
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ICadrartTeamMember } from '@manuszep/cadrart2025-common';

import { CadrartOffer } from './offer.entity';

@Entity('team_member')
export class CadrartTeamMember extends BaseEntity implements ICadrartTeamMember {
  @PrimaryGeneratedColumn()
  id!: number;

  name: string;

  @AfterLoad()
  getFullName(): void {
    const firstName = this.firstName && this.firstName.length > 0 ? `${this.firstName} ` : '';

    this.name = `${firstName}${this.lastName}`;
  }

  @Column({ type: 'varchar', length: 50 })
  lastName!: string;

  @Column({ type: 'varchar', length: 50 })
  firstName!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 150, nullable: false, unique: true })
  mail?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @Column({ type: 'varchar', length: 20, nullable: true, default: 'default' })
  image: string;

  @OneToMany(() => CadrartOffer, (offer: CadrartOffer) => offer.assignedTo, {
    nullable: true
  })
  offers?: CadrartOffer[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password === '') {
      this.password = undefined;
    }

    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}

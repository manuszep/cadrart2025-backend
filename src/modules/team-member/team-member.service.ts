import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { CadrartBaseService, ICadrartBaseServiceFindParam } from '../../base/base.service';
import { CadrartTeamMember } from '../../entities/team-member.entity';

@Injectable()
export class CadrartTeamMemberService extends CadrartBaseService<CadrartTeamMember> {
  entityName = 'TeamMember';

  constructor(
    @InjectRepository(CadrartTeamMember)
    private teamMembersRepository: Repository<CadrartTeamMember>
  ) {
    super(teamMembersRepository);
  }

  async findOneByEmail(mail: string): Promise<CadrartTeamMember> {
    return this.teamMembersRepository.findOne({
      where: { mail },
      select: ['id', 'firstName', 'lastName', 'mail', 'password', 'image']
    });
  }

  async update(id: string, updatedEntityDTO: CadrartTeamMember): Promise<CadrartTeamMember> {
    const entity = await this.findOne(id);
    const entityWithoutPassword = { ...entity, password: undefined };

    const updatedEntity = this.repository.create({
      ...entityWithoutPassword,
      ...updatedEntityDTO
    });

    return this.repository.save(updatedEntity);
  }

  getSearchConfig(needle: string): ICadrartBaseServiceFindParam<CadrartTeamMember> {
    if (!needle) {
      return [];
    }

    const pattern = `%${needle}%`;

    return [{ firstName: Like(pattern) }, { lastName: Like(pattern) }, { mail: Like(pattern) }];
  }
}

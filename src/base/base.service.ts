import { NotFoundException } from '@nestjs/common';
import { Repository, FindManyOptions, BaseEntity, FindOptionsWhere } from 'typeorm';

interface ICadrartBaseEntityProps {
  id: number;
}

export interface ICadrartBaseEntity extends BaseEntity, ICadrartBaseEntityProps {}

export abstract class CadrartBaseService<T extends ICadrartBaseEntity> {
  abstract entityName: string;
  protected relations: string[] = [];
  protected findOptions: FindManyOptions<T> = {};

  protected findAllrelations: string[] = [];
  protected findAllOptions: FindManyOptions<T> = {};
  protected findOnerelations: string[] = [];
  protected findOneOptions: FindManyOptions<T> = {};

  constructor(protected readonly repository: Repository<T>) {}

  async create(entity: T): Promise<T> {
    const newEntity = this.repository.create(entity);

    return this.repository.save(newEntity);
  }

  async findAll(page = 1, count = 20): Promise<{ entities: T[]; total: number }> {
    const skip = count * (page - 1);
    const res = await this.repository.findAndCount({
      ...this.findAllOptions,
      relations: this.findAllrelations,
      take: count,
      skip: skip
    });

    return { entities: res[0], total: res[1] };
  }

  async findOne(id: string): Promise<T> {
    const entity = this.repository.findOne({
      where: {
        id: id
      } as unknown as FindOptionsWhere<T>,
      ...this.findOneOptions,
      relations: this.findOnerelations
    });

    if (!entity || typeof entity === 'undefined') {
      throw new NotFoundException(`${this.entityName} #${id} not found`);
    }

    return entity as Promise<T>;
  }

  async update(id: string, updatedEntityDTO: T): Promise<T> {
    const entity = await this.findOne(id);

    const updatedEntity = this.repository.create({
      ...entity,
      ...updatedEntityDTO
    });

    return this.repository.save(updatedEntity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);

    await this.repository.remove(entity);
  }
}

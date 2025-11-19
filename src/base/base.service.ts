import { NotFoundException } from '@nestjs/common';
import { CadrartSocketService } from 'src/socket/socket.service';
import { Repository, FindManyOptions, BaseEntity, FindOptionsWhere, DeepPartial } from 'typeorm';

interface ICadrartBaseEntityProps {
  id: number;
}

export interface ICadrartBaseEntity extends BaseEntity, ICadrartBaseEntityProps {}

export type ICadrartBaseServiceFindParam<T> = FindOptionsWhere<T> | FindOptionsWhere<T>[];

export abstract class CadrartBaseService<T extends ICadrartBaseEntity, CreateDto = unknown, UpdateDto = unknown> {
  abstract entityName: string;
  protected relations: string[] = [];
  protected findOptions: FindManyOptions<T> = {};

  protected findAllrelations: string[] = [];
  protected findAllOptions: FindManyOptions<T> = {};
  protected findOnerelations: string[] = [];
  protected findOneOptions: FindManyOptions<T> = {};

  constructor(
    protected readonly repository: Repository<T>,
    protected readonly socket: CadrartSocketService
  ) {}

  async create(dto: CreateDto): Promise<T> {
    const newEntity = this.repository.create(dto as DeepPartial<T>);

    return this.repository.save(newEntity).then((value) => {
      this.socket.socket?.emit('create', {
        name: this.entityName,
        entity: value
      });

      return value;
    });
  }

  async findAll(page = 1, count = 20, needle?: string): Promise<{ entities: T[]; total: number }> {
    const skip = count * (page - 1);
    const where = this.getSearchConfig(needle);
    const res = await this.repository.findAndCount({
      ...this.findAllOptions,
      relations: this.findAllrelations,
      take: count,
      skip: skip,
      where
    });

    return { entities: res[0], total: res[1] };
  }

  getSearchConfig(needle: string): ICadrartBaseServiceFindParam<T> {
    if (!needle) {
      return [];
    }

    return [];
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

  async update(id: string, dto: UpdateDto): Promise<T> {
    const entity = await this.findOne(id);
    const updatedEntity = this.repository.create({
      ...entity,
      ...(dto as DeepPartial<T>)
    });

    return this.repository.save(updatedEntity).then((value) => {
      this.socket.socket?.emit('update', {
        name: this.entityName,
        entity: value
      });

      return value;
    });
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.remove(entity).then(() => {
      this.socket.socket?.emit('delete', {
        name: this.entityName,
        id
      });
    });
  }
}

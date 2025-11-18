import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { CadrartBaseService } from '../../base/base.service';
import { CadrartLocation } from '../../entities/location.entity';
import { CreateLocationDto, UpdateLocationDto } from '../../dto/location.dto';
import { CadrartSocketService } from '../../socket/socket.service';

@Injectable()
export class CadrartLocationService extends CadrartBaseService<CadrartLocation, CreateLocationDto, UpdateLocationDto> {
  entityName = 'Location';

  constructor(
    @InjectRepository(CadrartLocation) locationsRepository: Repository<CadrartLocation>,
    protected readonly socket: CadrartSocketService
  ) {
    super(locationsRepository, socket);
  }

  async search(needle: string): Promise<CadrartLocation[]> {
    const pattern = `%${needle}%`;

    return this.repository.find({
      where: [{ name: Like(pattern) }]
    });
  }
}

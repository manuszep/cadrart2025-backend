import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindManyOptions,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import {
  ECadrartOfferStatus,
  addWeeks,
  resetDateHMS,
} from '@manuszep/cadrart2025-common';

import { CadrartBaseService } from '../../base/base.service';
import { CadrartOffer } from '../../entities/offer.entity';

/**
 *  Generate a new offer number in the format yyyymm-xxxx
 */
function generateOfferNumber(latestOffer: CadrartOffer) {
  // Get date year and month
  const d = new Date();
  const year = d.getFullYear();
  // Pad month number with 0 if needed. Also, the month is 0 based so do +1
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const offerNumberPrefix = `${year}${month}-`;
  let offerNumberSuffix = '0';

  // The method receives the latest offer from the DB. So it can compare the number and increment
  if (latestOffer && latestOffer.number) {
    // Find an remove the prefix in the latest offer number
    const latestSuffix = latestOffer.number.replace(offerNumberPrefix, '');

    // If the prefix was not found, the offer number is still the same and we're on a new month / year so start from 0
    offerNumberSuffix =
      latestSuffix === latestOffer.number ? offerNumberSuffix : latestSuffix;
  }

  // Generate final number by incrementing and padding
  offerNumberSuffix = `${Number(offerNumberSuffix) + 1}`.padStart(4, '0');

  return `${offerNumberPrefix}${offerNumberSuffix}`;
}

@Injectable()
export class CadrartOfferService extends CadrartBaseService<CadrartOffer> {
  entityName = 'Offer';
  override findAllrelations = ['client', 'assignedTo'];
  override findAllOptions: FindManyOptions<CadrartOffer> = {
    order: { createdAt: 'DESC' },
  };
  override findOnerelations = [
    'client',
    'assignedTo',
    'jobs',
    'jobs.location',
    'jobs.tasks',
    'jobs.tasks.article',
    'jobs.tasks.children',
    'jobs.tasks.children.article',
  ];

  constructor(
    @InjectRepository(CadrartOffer)
    private offersRepository: Repository<CadrartOffer>,
  ) {
    super(offersRepository);
  }

  override async create(offer: CadrartOffer): Promise<CadrartOffer> {
    const newOffer = this.offersRepository.create(offer);
    const latestOffer = await this.findLatest();

    newOffer.number = generateOfferNumber(latestOffer);

    return this.offersRepository.save(newOffer);
  }

  async findAll(
    page = 1,
    count = 20,
    createdAtLt?: string,
    createdAtGt?: string,
    status?: ECadrartOfferStatus,
  ): Promise<{ entities: CadrartOffer[]; total: number }> {
    const skip = count * (page - 1);
    const where: { createdAt?: any; status?: ECadrartOfferStatus } = {};
    const createdAtLtDate = createdAtLt
      ? new Date(createdAtLt).toISOString()
      : null;
    const createdAtGtDate = createdAtGt
      ? new Date(createdAtGt).toISOString()
      : null;

    if (createdAtLtDate && createdAtGtDate) {
      where.createdAt = Between(createdAtGtDate, createdAtLtDate);
    } else if (createdAtLtDate) {
      where.createdAt = LessThanOrEqual(createdAtLtDate);
    } else if (createdAtGtDate) {
      where.createdAt = MoreThanOrEqual(createdAtGtDate);
    }

    if (status) {
      where.status = status;
    }

    const res = await this.repository.findAndCount({
      ...this.findAllOptions,
      where,
      relations: this.findAllrelations,
      take: count,
      skip: skip,
    });

    return { entities: res[0], total: res[1] };
  }

  async findAllByClient(clientId: number): Promise<CadrartOffer[]> {
    return this.offersRepository.find({
      where: { client: { id: clientId } },
      order: { createdAt: 'DESC' },
      relations: [
        'client',
        'assignedTo',
        'jobs',
        'jobs.tasks',
        'jobs.tasks.article',
      ],
    });
  }

  async findAllOpen(): Promise<CadrartOffer[]> {
    return this.offersRepository.find({
      where: { status: ECadrartOfferStatus.STATUS_STARTED },
      order: { createdAt: 'DESC' },
      relations: ['client', 'assignedTo'],
    });
  }

  async findLatest(): Promise<CadrartOffer | undefined> {
    const offer = this.offersRepository.findOne({
      where: {},
      order: { createdAt: 'DESC' },
      relations: ['client', 'assignedTo'],
    });

    return offer;
  }
}
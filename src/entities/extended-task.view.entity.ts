import { ViewEntity, ViewColumn, BaseEntity } from 'typeorm';
import { ECadrartOfferStatus, ICadrartExtendedTask } from '@manuszep/cadrart2025-common';

@ViewEntity({
  expression:
    "SELECT\
      `task`.`id` AS `id`,\
      `task`.`comment` AS `taskComment`,\
      `task`.`total` AS `taskTotal`,\
      `task`.`image` AS `taskImage`,\
      `task`.`doneCount` AS `taskDoneCount`,\
      `task`.`parentId` AS `taskParentId`,\
      `job`.`id` AS `jobId`,\
      `job`.`count` AS `jobCount`,\
      `job`.`orientation` AS `jobOrientation`,\
      `job`.`measure` AS `jobMeasure`,\
      `job`.`dueDate` AS `jobDueDate`,\
      `job`.`startDate` AS `jobStartDate`,\
      `job`.`openingWidth` AS `jobOpeningWidth`,\
      `job`.`openingHeight` AS `jobOpeningHeight`,\
      `job`.`marginWidth` AS `jobMarginWidth`,\
      `job`.`marginHeight` AS `jobMarginHeight`,\
      `job`.`glassWidth` AS `jobGlassWidth`,\
      `job`.`glassHeight` AS `jobGlassHeight`,\
      `job`.`description` AS `jobDescription`,\
      `job`.`image` AS `jobImage`,\
      `job`.`location`->>'$.name' AS `jobLocation`,\
      `task`.`article`->>'$.id' AS `articleId`,\
      `task`.`article`->>'$.name' AS `articleName`,\
      `task`.`article`->>'$.place' AS `articlePlace`,\
      `task`.`article`->>'$.family' AS `articleFamily`,\
      `offer`.`id` AS `offerId`,\
      `offer`.`status` AS `offerStatus`,\
      `offer`.`assignedTo`->>'$.id' AS `assignedToId`,\
      `offer`.`assignedTo`->>'$.firstName' AS `assignedToFirstName`,\
      `offer`.`assignedTo`->>'$.lastName' AS `assignedToLastName`,\
      `offer`.`client`->>'$.id' AS `clientId`,\
      `offer`.`client`->>'$.firstName' AS `clientFirstName`,\
      `offer`.`client`->>'$.lastName' AS `clientLastName`\
    FROM `task`\
    LEFT JOIN `job` ON `task`.`jobId`=`job`.`id`\
    LEFT JOIN `offer` ON `job`.`offerId`=`offer`.`id`\
    WHERE `offer`.`status` = '" +
    ECadrartOfferStatus.STATUS_STARTED +
    "';"
})
export class CadrartExtendedTask extends BaseEntity implements ICadrartExtendedTask {
  @ViewColumn()
  id!: number;

  @ViewColumn()
  taskComment!: string;

  @ViewColumn()
  taskTotal!: number;

  @ViewColumn()
  taskImage!: string;

  @ViewColumn()
  taskDoneCount!: number;

  @ViewColumn()
  taskParentId!: number;

  @ViewColumn()
  jobId!: number;

  @ViewColumn()
  jobCount!: number;

  @ViewColumn()
  jobOrientation!: number;

  @ViewColumn()
  jobMeasure!: number;

  @ViewColumn()
  jobDueDate!: Date;

  @ViewColumn()
  jobStartDate!: Date;

  @ViewColumn()
  jobOpeningWidth!: number;

  @ViewColumn()
  jobOpeningHeight!: number;

  @ViewColumn()
  jobMarginWidth!: number;

  @ViewColumn()
  jobMarginHeight!: number;

  @ViewColumn()
  jobGlassWidth!: number;

  @ViewColumn()
  jobGlassHeight!: number;

  @ViewColumn()
  jobDescription!: string;

  @ViewColumn()
  jobImage!: string;

  @ViewColumn()
  jobLocation!: string;

  @ViewColumn()
  articleId!: number;

  @ViewColumn()
  articleName!: string;

  @ViewColumn()
  articlePlace!: string;

  @ViewColumn()
  articleFamily!: number;

  @ViewColumn()
  offerId!: number;

  @ViewColumn()
  offerStatus!: number;

  @ViewColumn()
  assignedToId!: number;

  @ViewColumn()
  assignedToFirstName!: string;

  @ViewColumn()
  assignedToLastName!: string;

  @ViewColumn()
  clientId!: number;

  @ViewColumn()
  clientFirstName!: string;

  @ViewColumn()
  clientLastName!: string;
}

import { ViewEntity, ViewColumn, BaseEntity } from 'typeorm';
import { ICadrartExtendedTask } from '@manuszep/cadrart2025-common';

@ViewEntity({
  expression:
    'SELECT\
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
      `location`.`name` AS `jobLocation`,\
      `article`.`id` AS `articleId`,\
      `article`.`name` AS `articleName`,\
      `article`.`place` AS `articlePlace`,\
      `article`.`family` AS `articleFamily`,\
      `offer`.`id` AS `offerId`,\
      `offer`.`status` AS `offerStatus`,\
      `team_member`.`id` AS `assignedToId`,\
      `team_member`.`firstName` AS `assignedToFirstName`,\
      `team_member`.`lastName` AS `assignedToLastName`,\
      `client`.`id` AS `clientId`,\
      `client`.`firstName` AS `clientFirstName`,\
      `client`.`lastName` AS `clientLastName`\
    FROM `task`\
    LEFT JOIN `job` ON `task`.`jobId`=`job`.`id`\
    LEFT JOIN `article` ON `task`.`articleId`=`article`.`id`\
    LEFT JOIN `offer` ON `job`.`offerId`=`offer`.`id`\
    LEFT JOIN `client` ON `offer`.`clientId`=`client`.`id`\
    LEFT JOIN `location` ON `job`.`locationId`=`location`.`id`\
    LEFT JOIN `team_member` ON `offer`.`assignedToId`=`team_member`.`id`',
})
export class CadrartExtendedTask
  extends BaseEntity
  implements ICadrartExtendedTask
{
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

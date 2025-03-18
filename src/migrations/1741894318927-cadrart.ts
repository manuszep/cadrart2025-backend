import { MigrationInterface, QueryRunner } from 'typeorm';

export class Cadrart1741894318927 implements MigrationInterface {
  name = 'Cadrart1741894318927';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE VIEW \`cadrart_extended_task\` AS SELECT      \`task\`.\`id\` AS \`id\`,      \`task\`.\`comment\` AS \`taskComment\`,      \`task\`.\`total\` AS \`taskTotal\`,      \`task\`.\`image\` AS \`taskImage\`,      \`task\`.\`doneCount\` AS \`taskDoneCount\`,      \`task\`.\`parentId\` AS \`taskParentId\`,      \`job\`.\`id\` AS \`jobId\`,      \`job\`.\`count\` AS \`jobCount\`,      \`job\`.\`orientation\` AS \`jobOrientation\`,      \`job\`.\`measure\` AS \`jobMeasure\`,      \`job\`.\`dueDate\` AS \`jobDueDate\`,      \`job\`.\`startDate\` AS \`jobStartDate\`,      \`job\`.\`openingWidth\` AS \`jobOpeningWidth\`,      \`job\`.\`openingHeight\` AS \`jobOpeningHeight\`,      \`job\`.\`marginWidth\` AS \`jobMarginWidth\`,      \`job\`.\`marginHeight\` AS \`jobMarginHeight\`,      \`job\`.\`glassWidth\` AS \`jobGlassWidth\`,      \`job\`.\`glassHeight\` AS \`jobGlassHeight\`,      \`job\`.\`description\` AS \`jobDescription\`,      \`job\`.\`image\` AS \`jobImage\`,      \`job\`.\`location\`->>'$.name' AS \`jobLocation\`,      \`task\`.\`article\`->>'$.id' AS \`articleId\`,      \`task\`.\`article\`->>'$.name' AS \`articleName\`,      \`task\`.\`article\`->>'$.place' AS \`articlePlace\`,      \`task\`.\`article\`->>'$.family' AS \`articleFamily\`,      \`offer\`.\`id\` AS \`offerId\`,      \`offer\`.\`status\` AS \`offerStatus\`,      \`offer\`.\`assignedTo\`->>'$.id' AS \`assignedToId\`,      \`offer\`.\`assignedTo\`->>'$.firstName' AS \`assignedToFirstName\`,      \`offer\`.\`assignedTo\`->>'$.lastName' AS \`assignedToLastName\`,      \`offer\`.\`client\`->>'$.id' AS \`clientId\`,      \`offer\`.\`client\`->>'$.firstName' AS \`clientFirstName\`,      \`offer\`.\`client\`->>'$.lastName' AS \`clientLastName\`    FROM \`task\`    LEFT JOIN \`job\` ON \`task\`.\`jobId\`=\`job\`.\`id\`    LEFT JOIN \`offer\` ON \`job\`.\`offerId\`=\`offer\`.\`id\` WHERE \`offer\`.\`status\` = '1'`
    );
    await queryRunner.query(
      `INSERT INTO \`cadrart2024\`.\`typeorm_metadata\`(\`database\`, \`schema\`, \`table\`, \`type\`, \`name\`, \`value\`) VALUES (DEFAULT, ?, DEFAULT, ?, ?, ?)`,
      [
        'cadrart2024',
        'VIEW',
        'cadrart_extended_task',
        "SELECT      `task`.`id` AS `id`,      `task`.`comment` AS `taskComment`,      `task`.`total` AS `taskTotal`,      `task`.`image` AS `taskImage`,      `task`.`doneCount` AS `taskDoneCount`,      `task`.`parentId` AS `taskParentId`,      `job`.`id` AS `jobId`,      `job`.`count` AS `jobCount`,      `job`.`orientation` AS `jobOrientation`,      `job`.`measure` AS `jobMeasure`,      `job`.`dueDate` AS `jobDueDate`,      `job`.`startDate` AS `jobStartDate`,      `job`.`openingWidth` AS `jobOpeningWidth`,      `job`.`openingHeight` AS `jobOpeningHeight`,      `job`.`marginWidth` AS `jobMarginWidth`,      `job`.`marginHeight` AS `jobMarginHeight`,      `job`.`glassWidth` AS `jobGlassWidth`,      `job`.`glassHeight` AS `jobGlassHeight`,      `job`.`description` AS `jobDescription`,      `job`.`image` AS `jobImage`,      `job`.`location`->>'$.name' AS `jobLocation`,      `task`.`article`->>'$.id' AS `articleId`,      `task`.`article`->>'$.name' AS `articleName`,      `task`.`article`->>'$.place' AS `articlePlace`,      `task`.`article`->>'$.family' AS `articleFamily`,      `offer`.`id` AS `offerId`,      `offer`.`status` AS `offerStatus`,      `offer`.`assignedTo`->>'$.id' AS `assignedToId`,      `offer`.`assignedTo`->>'$.firstName' AS `assignedToFirstName`,      `offer`.`assignedTo`->>'$.lastName' AS `assignedToLastName`,      `offer`.`client`->>'$.id' AS `clientId`,      `offer`.`client`->>'$.firstName' AS `clientFirstName`,      `offer`.`client`->>'$.lastName' AS `clientLastName`    FROM `task`    LEFT JOIN `job` ON `task`.`jobId`=`job`.`id`    LEFT JOIN `offer` ON `job`.`offerId`=`offer`.`id` WHERE `offer`.`status` = '1'"
      ]
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM \`cadrart2024\`.\`typeorm_metadata\` WHERE \`type\` = ? AND \`name\` = ? AND \`schema\` = ?`,
      ['VIEW', 'cadrart_extended_task', 'cadrart2024']
    );
    await queryRunner.query(`DROP VIEW \`cadrart_extended_task\``);
  }
}

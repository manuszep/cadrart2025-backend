import { MigrationInterface, QueryRunner } from "typeorm";

export class Cadrart1768375266307 implements MigrationInterface {
    name = 'Cadrart1768375266307'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE VIEW \`extendedTask\` AS 
    SELECT
      task.id AS id,
      task.comment AS taskComment,
      task.total AS taskTotal,
      task.image AS taskImage,
      task.doneCount AS taskDoneCount,
      task.parentId AS parentId,
      job.id AS jobId,
      job.count AS jobCount,
      job.orientation AS jobOrientation,
      job.measure AS jobMeasure,
      job.dueDate AS jobDueDate,
      job.startDate AS jobStartDate,
      job.openingWidth AS jobOpeningWidth,
      job.openingHeight AS jobOpeningHeight,
      job.marginWidth AS jobMarginWidth,
      job.marginHeight AS jobMarginHeight,
      job.glassWidth AS jobGlassWidth,
      job.glassHeight AS jobGlassHeight,
      job.description AS jobDescription,
      job.image AS jobImage,
      job.location AS jobLocation,
      JSON_EXTRACT(task.article, "$.id") AS articleId,
      JSON_EXTRACT(task.article, "$.name") AS articleName,
      JSON_EXTRACT(task.article, "$.place") AS articlePlace,
      JSON_EXTRACT(task.article, "$.family") AS articleFamily,
      originalArticle.outOfStock AS articleOutOfStock,
      offer.id AS offerId,
      offer.status AS offerStatus,
      JSON_EXTRACT(offer.assignedTo, "$.id") AS assignedToId,
      JSON_EXTRACT(offer.assignedTo, "$.firstName") AS assignedToFirstName,
      JSON_EXTRACT(offer.assignedTo, "$.lastName") AS assignedToLastName,
      JSON_EXTRACT(offer.client, "$.id") AS clientId,
      JSON_EXTRACT(offer.client, "$.firstName") AS clientFirstName,
      JSON_EXTRACT(offer.client, "$.lastName") AS clientLastName
    FROM offer AS offer
    LEFT JOIN job AS job ON offer.id = job.offerId
    LEFT JOIN task AS task ON job.id = task.jobId
    LEFT JOIN article AS originalArticle ON originalArticle.id = JSON_EXTRACT(task.article, "$.id")
    WHERE offer.status = "1"
  `);
        await queryRunner.query(`INSERT INTO \`cadrart2024\`.\`typeorm_metadata\`(\`database\`, \`schema\`, \`table\`, \`type\`, \`name\`, \`value\`) VALUES (DEFAULT, ?, DEFAULT, ?, ?, ?)`, ["cadrart2024","VIEW","extendedTask","SELECT\n      task.id AS id,\n      task.comment AS taskComment,\n      task.total AS taskTotal,\n      task.image AS taskImage,\n      task.doneCount AS taskDoneCount,\n      task.parentId AS parentId,\n      job.id AS jobId,\n      job.count AS jobCount,\n      job.orientation AS jobOrientation,\n      job.measure AS jobMeasure,\n      job.dueDate AS jobDueDate,\n      job.startDate AS jobStartDate,\n      job.openingWidth AS jobOpeningWidth,\n      job.openingHeight AS jobOpeningHeight,\n      job.marginWidth AS jobMarginWidth,\n      job.marginHeight AS jobMarginHeight,\n      job.glassWidth AS jobGlassWidth,\n      job.glassHeight AS jobGlassHeight,\n      job.description AS jobDescription,\n      job.image AS jobImage,\n      job.location AS jobLocation,\n      JSON_EXTRACT(task.article, \"$.id\") AS articleId,\n      JSON_EXTRACT(task.article, \"$.name\") AS articleName,\n      JSON_EXTRACT(task.article, \"$.place\") AS articlePlace,\n      JSON_EXTRACT(task.article, \"$.family\") AS articleFamily,\n      originalArticle.outOfStock AS articleOutOfStock,\n      offer.id AS offerId,\n      offer.status AS offerStatus,\n      JSON_EXTRACT(offer.assignedTo, \"$.id\") AS assignedToId,\n      JSON_EXTRACT(offer.assignedTo, \"$.firstName\") AS assignedToFirstName,\n      JSON_EXTRACT(offer.assignedTo, \"$.lastName\") AS assignedToLastName,\n      JSON_EXTRACT(offer.client, \"$.id\") AS clientId,\n      JSON_EXTRACT(offer.client, \"$.firstName\") AS clientFirstName,\n      JSON_EXTRACT(offer.client, \"$.lastName\") AS clientLastName\n    FROM offer AS offer\n    LEFT JOIN job AS job ON offer.id = job.offerId\n    LEFT JOIN task AS task ON job.id = task.jobId\n    LEFT JOIN article AS originalArticle ON originalArticle.id = JSON_EXTRACT(task.article, \"$.id\")\n    WHERE offer.status = \"1\""]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM \`cadrart2024\`.\`typeorm_metadata\` WHERE \`type\` = ? AND \`name\` = ? AND \`schema\` = ?`, ["VIEW","extendedTask","cadrart2024"]);
        await queryRunner.query(`DROP VIEW \`extendedTask\``);
    }

}

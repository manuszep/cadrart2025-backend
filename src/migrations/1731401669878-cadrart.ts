import { MigrationInterface, QueryRunner } from "typeorm";

export class Cadrart1731401669878 implements MigrationInterface {
    name = 'Cadrart1731401669878'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_31622b10176fdaab44817d48e1f\``);
        await queryRunner.query(`ALTER TABLE \`job\` DROP FOREIGN KEY \`FK_e9238c85e383495936b122f19c8\``);
        await queryRunner.query(`ALTER TABLE \`offer\` DROP FOREIGN KEY \`FK_33f52941f5a09dc76f17d5fef8a\``);
        await queryRunner.query(`ALTER TABLE \`offer\` DROP FOREIGN KEY \`FK_c34bf218415e0476fd239efa0e4\``);
        await queryRunner.query(`ALTER TABLE \`task\` CHANGE \`articleId\` \`article\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`job\` DROP COLUMN \`locationId\``);
        await queryRunner.query(`ALTER TABLE \`offer\` DROP COLUMN \`clientId\``);
        await queryRunner.query(`ALTER TABLE \`offer\` DROP COLUMN \`assignedToId\``);
        await queryRunner.query(`ALTER TABLE \`job\` ADD \`location\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`offer\` ADD \`client\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`offer\` ADD \`assignedTo\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`task\` DROP COLUMN \`article\``);
        await queryRunner.query(`ALTER TABLE \`task\` ADD \`article\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`job\` DROP COLUMN \`dueDate\``);
        await queryRunner.query(`ALTER TABLE \`job\` ADD \`dueDate\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`team_member\` CHANGE \`image\` \`image\` varchar(20) NULL DEFAULT 'default'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`team_member\` CHANGE \`image\` \`image\` varchar(20) NOT NULL DEFAULT 'default.jpg'`);
        await queryRunner.query(`ALTER TABLE \`job\` DROP COLUMN \`dueDate\``);
        await queryRunner.query(`ALTER TABLE \`job\` ADD \`dueDate\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`task\` DROP COLUMN \`article\``);
        await queryRunner.query(`ALTER TABLE \`task\` ADD \`article\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`offer\` DROP COLUMN \`assignedTo\``);
        await queryRunner.query(`ALTER TABLE \`offer\` DROP COLUMN \`client\``);
        await queryRunner.query(`ALTER TABLE \`job\` DROP COLUMN \`location\``);
        await queryRunner.query(`ALTER TABLE \`offer\` ADD \`assignedToId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`offer\` ADD \`clientId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`job\` ADD \`locationId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`task\` CHANGE \`article\` \`articleId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`offer\` ADD CONSTRAINT \`FK_c34bf218415e0476fd239efa0e4\` FOREIGN KEY (\`assignedToId\`) REFERENCES \`team_member\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`offer\` ADD CONSTRAINT \`FK_33f52941f5a09dc76f17d5fef8a\` FOREIGN KEY (\`clientId\`) REFERENCES \`client\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`job\` ADD CONSTRAINT \`FK_e9238c85e383495936b122f19c8\` FOREIGN KEY (\`locationId\`) REFERENCES \`location\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_31622b10176fdaab44817d48e1f\` FOREIGN KEY (\`articleId\`) REFERENCES \`article\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

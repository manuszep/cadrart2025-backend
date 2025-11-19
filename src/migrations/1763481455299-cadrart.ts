import { MigrationInterface, QueryRunner } from "typeorm";

export class Cadrart1763481455299 implements MigrationInterface {
    name = 'Cadrart1763481455299'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`article\` ADD \`outOfStock\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`article\` DROP COLUMN \`outOfStock\``);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class UserMigration1735615448642 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`user\` RENAME COLUMN \`name\` TO \`firstName\``,
        );
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`user\` RENAME COLUMN \`firstName\` TO \`name\``,
        ); // reverts changes made in "up" method
    }

}

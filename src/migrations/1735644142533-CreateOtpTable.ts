import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOtpTable1735644142533 implements MigrationInterface {
    name = 'CreateOtpTable1735644142533'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`otp\` (\`Id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`otp\` varchar(255) NOT NULL, \`tokenExpiresIn\` timestamp NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`Id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`otp\``);
    }

}

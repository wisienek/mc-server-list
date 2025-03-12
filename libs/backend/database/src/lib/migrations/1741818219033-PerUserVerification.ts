import type {MigrationInterface, QueryRunner} from 'typeorm';

export class PerUserVerification1741818219033 implements MigrationInterface {
    name = 'PerUserVerification1741818219033';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`TRUNCATE "server_verification"`);
        await queryRunner.query(
            `ALTER TABLE "server_verification" ADD "user_id" uuid NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "server_verification" DROP CONSTRAINT "FK_0c1d54679d1790d7c44c8361128"`,
        );
        await queryRunner.query(
            `ALTER TABLE "server_verification" DROP CONSTRAINT "REL_0c1d54679d1790d7c44c836112"`,
        );
        await queryRunner.query(
            `ALTER TABLE "server_verification" ADD CONSTRAINT "UQ_8e2f7266730b9d416357142e9ca" UNIQUE ("server_id", "user_id")`,
        );
        await queryRunner.query(
            `ALTER TABLE "server_verification" ADD CONSTRAINT "FK_0c1d54679d1790d7c44c8361128" FOREIGN KEY ("server_id") REFERENCES "server"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "server_verification" ADD CONSTRAINT "FK_fc8d41305a786e426b06a215135" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "server_verification" DROP CONSTRAINT "FK_fc8d41305a786e426b06a215135"`,
        );
        await queryRunner.query(
            `ALTER TABLE "server_verification" DROP CONSTRAINT "FK_0c1d54679d1790d7c44c8361128"`,
        );
        await queryRunner.query(
            `ALTER TABLE "server_verification" DROP CONSTRAINT "UQ_8e2f7266730b9d416357142e9ca"`,
        );
        await queryRunner.query(
            `ALTER TABLE "server_verification" ADD CONSTRAINT "REL_0c1d54679d1790d7c44c836112" UNIQUE ("server_id")`,
        );
        await queryRunner.query(
            `ALTER TABLE "server_verification" ADD CONSTRAINT "FK_0c1d54679d1790d7c44c8361128" FOREIGN KEY ("server_id") REFERENCES "server"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "server_verification" DROP COLUMN "user_id"`,
        );
    }
}

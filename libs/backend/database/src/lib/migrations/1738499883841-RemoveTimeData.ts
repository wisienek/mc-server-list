import type {MigrationInterface, QueryRunner} from 'typeorm';

export class RemoveTimeData1738499883841 implements MigrationInterface {
    name = 'RemoveTimeData1738499883841';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "server" DROP COLUMN "retrieved_at"`);
        await queryRunner.query(`ALTER TABLE "server" DROP COLUMN "expires_at"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "server" ADD "expires_at" bigint NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "server" ADD "retrieved_at" bigint NOT NULL`,
        );
    }
}

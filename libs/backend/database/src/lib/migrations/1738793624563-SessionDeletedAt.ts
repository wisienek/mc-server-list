import type {MigrationInterface, QueryRunner} from 'typeorm';

export class SessionDeletedAt1738793624563 implements MigrationInterface {
    name = 'SessionDeletedAt1738793624563';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" ADD "destroyedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "destroyedAt"`);
    }
}

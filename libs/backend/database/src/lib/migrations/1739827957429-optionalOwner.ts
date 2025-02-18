import type {MigrationInterface, QueryRunner} from 'typeorm';

export class OptionalOwner1739827957429 implements MigrationInterface {
    name = 'OptionalOwner1739827957429';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "server_verification" DROP COLUMN "expiresAt"`,
        );
        await queryRunner.query(
            `ALTER TABLE "server" ADD "isTimedOut" boolean NOT NULL DEFAULT false`,
        );
        await queryRunner.query(
            `ALTER TABLE "server" DROP CONSTRAINT "FK_552bfb87cd1acce7c512253a774"`,
        );
        await queryRunner.query(
            `ALTER TABLE "server" ALTER COLUMN "owner_id" DROP NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "server" ADD CONSTRAINT "FK_552bfb87cd1acce7c512253a774" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "server" DROP CONSTRAINT "FK_552bfb87cd1acce7c512253a774"`,
        );
        await queryRunner.query(
            `ALTER TABLE "server" ALTER COLUMN "owner_id" SET NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "server" ADD CONSTRAINT "FK_552bfb87cd1acce7c512253a774" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(`ALTER TABLE "server" DROP COLUMN "isTimedOut"`);
        await queryRunner.query(
            `ALTER TABLE "server_verification" ADD "expiresAt" bigint NOT NULL`,
        );
    }
}

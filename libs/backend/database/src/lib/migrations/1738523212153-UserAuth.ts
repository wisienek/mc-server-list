import type {MigrationInterface, QueryRunner} from 'typeorm';

export class UserAuth1738523212153 implements MigrationInterface {
    name = 'UserAuth1738523212153';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "discord_o_auth2_credentials" ("discord_id" character varying NOT NULL, "access_token" character varying NOT NULL, "refresh_token" character varying NOT NULL, CONSTRAINT "PK_c3db082bb3e66145a30ae53219c" PRIMARY KEY ("discord_id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "session" ("id" character varying(255) NOT NULL, "json" text NOT NULL, "expiredAt" bigint NOT NULL DEFAULT '1738523213652', CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_28c5d1d16da7908c97c9bc2f74" ON "session" ("expiredAt") `,
        );
        await queryRunner.query(
            `ALTER TABLE "user" ADD "discord_tag" character varying NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "user" ADD "avatar" character varying NOT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "discord_tag"`);
        await queryRunner.query(
            `DROP INDEX "public"."IDX_28c5d1d16da7908c97c9bc2f74"`,
        );
        await queryRunner.query(`DROP TABLE "session"`);
        await queryRunner.query(`DROP TABLE "discord_o_auth2_credentials"`);
    }
}

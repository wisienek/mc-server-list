import type {MigrationInterface, QueryRunner} from 'typeorm';

export class UserCredentials1738883140309 implements MigrationInterface {
    name = 'UserCredentials1738883140309';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "user_credentials" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "password" character varying, "user_id" uuid NOT NULL, CONSTRAINT "REL_dd0918407944553611bb3eb3dd" UNIQUE ("user_id"), CONSTRAINT "PK_5cadc04d03e2d9fe76e1b44eb34" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_credentials" ADD CONSTRAINT "FK_dd0918407944553611bb3eb3ddc" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user_credentials" DROP CONSTRAINT "FK_dd0918407944553611bb3eb3ddc"`,
        );
        await queryRunner.query(`DROP TABLE "user_credentials"`);
    }
}

import type {MigrationInterface, QueryRunner} from 'typeorm';

export class InitDB1738498523335 implements MigrationInterface {
    name = 'InitDB1738498523335';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "server_verification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "expiresAt" bigint NOT NULL, "verified" boolean NOT NULL DEFAULT false, "server_id" uuid NOT NULL, CONSTRAINT "REL_0c1d54679d1790d7c44c836112" UNIQUE ("server_id"), CONSTRAINT "PK_269cbd0a45e6948951f5f4638fd" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "discordId" character varying NOT NULL, "username" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_13af5754f14d8d255fd9b3ee5c7" UNIQUE ("discordId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."server_type_enum" AS ENUM('JAVA', 'BEDROCK')`,
        );
        await queryRunner.query(
            `CREATE TABLE "server" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "online" boolean NOT NULL, "host" character varying NOT NULL, "port" integer NOT NULL, "ip_address" character varying, "eula_blocked" boolean NOT NULL, "retrieved_at" bigint NOT NULL, "expires_at" bigint NOT NULL, "srv_record" jsonb NOT NULL, "owner_id" uuid NOT NULL, "isActive" boolean NOT NULL DEFAULT false, "versions" text array NOT NULL DEFAULT '{}', "players" jsonb, "motd" jsonb, "gamemode" character varying, "server_id" character varying, "icon" character varying, "mods" jsonb, "software" character varying, "plugins" jsonb, "type" "public"."server_type_enum" NOT NULL, CONSTRAINT "PK_f8b8af38bdc23b447c0a57c7937" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_7fc10dcb332df68e818f643f50" ON "server" ("type") `,
        );
        await queryRunner.query(
            `ALTER TABLE "server_verification" ADD CONSTRAINT "FK_0c1d54679d1790d7c44c8361128" FOREIGN KEY ("server_id") REFERENCES "server"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
            `ALTER TABLE "server_verification" DROP CONSTRAINT "FK_0c1d54679d1790d7c44c8361128"`,
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_7fc10dcb332df68e818f643f50"`,
        );
        await queryRunner.query(`DROP TABLE "server"`);
        await queryRunner.query(`DROP TYPE "public"."server_type_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "server_verification"`);
    }
}

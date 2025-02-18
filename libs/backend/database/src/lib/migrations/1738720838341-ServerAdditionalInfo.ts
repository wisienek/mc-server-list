import type {MigrationInterface, QueryRunner} from 'typeorm';

export class ServerAdditionalInfo1738720838341 implements MigrationInterface {
    name = 'ServerAdditionalInfo1738720838341';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "vote" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "server_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "UQ_f8c08a7a34e311bd9880084ad4b" UNIQUE ("server_id", "user_id"), CONSTRAINT "PK_2d5932d46afe39c8176f9d4be72" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."server_categories_enum" AS ENUM('Bedrock', 'Whitelist', 'Survival', 'Classic', 'Hardcore', 'Adventure', 'Vanilla', 'Semi-Vanilla', 'PvE', 'PvP', 'Roleplay', 'Economy', 'Tekkit', 'Skyblock', 'Factions', 'Hunger Games', 'Capture the Flag', 'McMMO', 'Feed The Beast', 'Land Claim', 'Lucky Block', 'Towny', 'Parkour', 'Skywars', 'Earth', 'Family Friendly', 'One Block', 'Anarchy', 'City Build', 'MineZ', 'Bedwars', 'Life Steal', 'Crossplay', 'Pixelmon', 'Cobblemon', 'KitPvP', 'Survival Games', 'Mini Games', 'Prison')`,
        );
        await queryRunner.query(
            `ALTER TABLE "server" ADD "categories" "public"."server_categories_enum" array NOT NULL DEFAULT '{}'`,
        );
        await queryRunner.query(
            `ALTER TABLE "server" ADD "banner" character varying`,
        );
        await queryRunner.query(`ALTER TABLE "server" ADD "name" character varying`);
        await queryRunner.query(
            `ALTER TABLE "server" ADD "description" character varying`,
        );
        await queryRunner.query(
            `ALTER TABLE "session" ALTER COLUMN "expiredAt" SET DEFAULT '1738720839592'`,
        );
        await queryRunner.query(
            `ALTER TABLE "vote" ADD CONSTRAINT "FK_ff02c63084edb99efd41534defd" FOREIGN KEY ("server_id") REFERENCES "server"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "vote" ADD CONSTRAINT "FK_af8728cf605f1988d2007d094f5" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "vote" DROP CONSTRAINT "FK_af8728cf605f1988d2007d094f5"`,
        );
        await queryRunner.query(
            `ALTER TABLE "vote" DROP CONSTRAINT "FK_ff02c63084edb99efd41534defd"`,
        );
        await queryRunner.query(
            `ALTER TABLE "session" ALTER COLUMN "expiredAt" SET DEFAULT '1738523213652'`,
        );
        await queryRunner.query(`ALTER TABLE "server" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "server" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "server" DROP COLUMN "banner"`);
        await queryRunner.query(`ALTER TABLE "server" DROP COLUMN "categories"`);
        await queryRunner.query(`DROP TYPE "public"."server_categories_enum"`);
        await queryRunner.query(`DROP TABLE "vote"`);
    }
}

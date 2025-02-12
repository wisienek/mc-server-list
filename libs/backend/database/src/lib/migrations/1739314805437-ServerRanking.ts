import type {MigrationInterface, QueryRunner} from 'typeorm';

export class ServerRanking1739314805437 implements MigrationInterface {
    name = 'ServerRanking1739314805437';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "server" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
        );
        await queryRunner.query(
            `ALTER TABLE "server" ALTER COLUMN "type" SET DEFAULT 'JAVA'`,
        );
        await queryRunner.query(
            `ALTER TABLE "server" ALTER COLUMN "motd" SET NOT NULL`,
        );
        await queryRunner.query(
            `CREATE VIEW server_ranking_view AS
SELECT
  s.id AS "serverId",
  ROW_NUMBER() OVER (
    ORDER BY COUNT(v.id) DESC, s."createdAt" ASC
  ) AS ranking,
  COUNT(v.id) AS "votesCount"
FROM server s
LEFT JOIN vote v ON v.server_id = s.id
GROUP BY s.id, s."createdAt";
`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP VIEW server_ranking_view`);
        await queryRunner.query(
            `ALTER TABLE "server" ALTER COLUMN "motd" DROP NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "server" ALTER COLUMN "type" DROP DEFAULT`,
        );
        await queryRunner.query(`ALTER TABLE "server" DROP COLUMN "createdAt"`);
    }
}

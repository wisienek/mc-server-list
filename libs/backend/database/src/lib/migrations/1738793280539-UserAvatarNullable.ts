import type {MigrationInterface, QueryRunner} from 'typeorm';

export class UserAvatarNullable1738793280539 implements MigrationInterface {
    name = 'UserAvatarNullable1738793280539';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user" ALTER COLUMN "avatar" DROP NOT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user" ALTER COLUMN "avatar" SET NOT NULL`,
        );
    }
}

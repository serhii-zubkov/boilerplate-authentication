import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import { User } from 'modules/crud/users/entities';
import { AuthService } from 'modules/common/auth/auth.service';
import { Role } from 'constants/index';

export class User1637546216331 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "User" (
        "userId" SERIAL NOT NULL,
        "firstName" character varying(255) NOT NULL,
        "lastName" character varying(255) NOT NULL,
        "email" character varying(255) NOT NULL,
        "passwordHash" character varying(60) NOT NULL,
        "roles" text[] NOT NULL DEFAULT '{${Role.User}}',
        "created" timestamp NOT NULL DEFAULT NOW(),
        "updated" timestamp NOT NULL DEFAULT NOW(),
        CONSTRAINT "PK_0ea8af24543da734f41663014e3" PRIMARY KEY ("userId")
      )`,
    );

    const now = new Date();
    await queryRunner.query(
      `INSERT INTO "User"("email", "passwordHash", "firstName", "lastName", "roles", "created", "updated") VALUES (
        'admin@gmail.com',
        '${await AuthService.hashPassword('admin')}',
        'Admin',
        'Admin',
        '{${Role.Admin}}',
        '${now.toISOString()}',
        '${now.toISOString()}'
      ) RETURNING "userId";`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "User"`);
  }
}

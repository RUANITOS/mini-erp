import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1760680889415 implements MigrationInterface {
    name = 'InitialSchema1760680889415'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_transactions_client"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_transactions_clientId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_transactions_kind_status_duedate"`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "clientId" SET NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."transaction_kind_enum" RENAME TO "transaction_kind_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_kind_enum" AS ENUM('PAYABLE', 'RECEIVABLE')`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "kind" TYPE "public"."transactions_kind_enum" USING "kind"::"text"::"public"."transactions_kind_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_kind_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."transaction_status_enum" RENAME TO "transaction_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_status_enum" AS ENUM('PENDING', 'PAID')`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "status" TYPE "public"."transactions_status_enum" USING "status"::"text"::"public"."transactions_status_enum"`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
        await queryRunner.query(`DROP TYPE "public"."transaction_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_605be897e18635c785596cbaa9c" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_605be897e18635c785596cbaa9c"`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_status_enum_old" AS ENUM('PENDING', 'PAID')`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "status" TYPE "public"."transaction_status_enum_old" USING "status"::"text"::"public"."transaction_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
        await queryRunner.query(`DROP TYPE "public"."transactions_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."transaction_status_enum_old" RENAME TO "transaction_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_kind_enum_old" AS ENUM('PAYABLE', 'RECEIVABLE')`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "kind" TYPE "public"."transaction_kind_enum_old" USING "kind"::"text"::"public"."transaction_kind_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_kind_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."transaction_kind_enum_old" RENAME TO "transaction_kind_enum"`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "clientId" DROP NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_transactions_kind_status_duedate" ON "transactions" ("dueDate", "kind", "status") `);
        await queryRunner.query(`CREATE INDEX "IDX_transactions_clientId" ON "transactions" ("clientId") `);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_transactions_client" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}

import {MigrationInterface, QueryRunner} from "typeorm";

export class PermissionRoleUserEntity1680670275830 implements MigrationInterface {
    name = 'PermissionRoleUserEntity1680670275830'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permission" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "name" character varying(80) NOT NULL, "description" character varying(100), CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_972bbdc048bf5d859b99488607" ON "permission" ("uuid") `);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "name" character varying(80) NOT NULL, "description" character varying(100), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_16fc336b9576146aa1f03fdc7c" ON "role" ("uuid") `);
        await queryRunner.query(`CREATE TYPE "public"."user_status_enum" AS ENUM('Active', 'Disabled', 'Suspended', 'Deactive', 'Unverified')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "priority" integer NOT NULL DEFAULT '0', "first_name" character varying(80), "last_name" character varying(80), "full_name" character varying(160), "username" character varying(100), "email" character varying, "password" character varying, "profile_image" json, "phone" character varying, "status" "public"."user_status_enum" NOT NULL DEFAULT 'Active', "user_meta_id" integer NOT NULL, "creator_id" integer, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_ec03dddce46b4c14e25b70f9dc" UNIQUE ("user_meta_id"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a95e949168be7b7ece1a2382fe" ON "user" ("uuid") `);
        await queryRunner.query(`CREATE TABLE "user_meta" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "last_login_at" TIMESTAMP WITH TIME ZONE, "last_failed_login_at" TIMESTAMP WITH TIME ZONE, "last_logout_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_2b45acc20c0a71d613f9ed6d9e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a68beed0919a8b7417341c5fa8" ON "user_meta" ("uuid") `);
        await queryRunner.query(`CREATE TABLE "role_permissions_permission" ("role_id" integer NOT NULL, "permission_id" integer NOT NULL, CONSTRAINT "PK_32d63c82505b0b1d565761ae201" PRIMARY KEY ("role_id", "permission_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0167acb6e0ccfcf0c6c140cec4" ON "role_permissions_permission" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_2d3e8e7c82bdee8553b6f1e332" ON "role_permissions_permission" ("permission_id") `);
        await queryRunner.query(`CREATE TABLE "user_role" ("user_id" integer NOT NULL, "role_id" integer NOT NULL, CONSTRAINT "PK_f634684acb47c1a158b83af5150" PRIMARY KEY ("user_id", "role_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d0e5815877f7395a198a4cb0a4" ON "user_role" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_32a6fc2fcb019d8e3a8ace0f55" ON "user_role" ("role_id") `);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_ec03dddce46b4c14e25b70f9dc8" FOREIGN KEY ("user_meta_id") REFERENCES "user_meta"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_b2cb578bbb4f0982ee3b842b787" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions_permission" ADD CONSTRAINT "FK_0167acb6e0ccfcf0c6c140cec4a" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permissions_permission" ADD CONSTRAINT "FK_2d3e8e7c82bdee8553b6f1e3325" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_d0e5815877f7395a198a4cb0a46" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_32a6fc2fcb019d8e3a8ace0f55f" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_32a6fc2fcb019d8e3a8ace0f55f"`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_d0e5815877f7395a198a4cb0a46"`);
        await queryRunner.query(`ALTER TABLE "role_permissions_permission" DROP CONSTRAINT "FK_2d3e8e7c82bdee8553b6f1e3325"`);
        await queryRunner.query(`ALTER TABLE "role_permissions_permission" DROP CONSTRAINT "FK_0167acb6e0ccfcf0c6c140cec4a"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_b2cb578bbb4f0982ee3b842b787"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_ec03dddce46b4c14e25b70f9dc8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_32a6fc2fcb019d8e3a8ace0f55"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d0e5815877f7395a198a4cb0a4"`);
        await queryRunner.query(`DROP TABLE "user_role"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2d3e8e7c82bdee8553b6f1e332"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0167acb6e0ccfcf0c6c140cec4"`);
        await queryRunner.query(`DROP TABLE "role_permissions_permission"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a68beed0919a8b7417341c5fa8"`);
        await queryRunner.query(`DROP TABLE "user_meta"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a95e949168be7b7ece1a2382fe"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_16fc336b9576146aa1f03fdc7c"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_972bbdc048bf5d859b99488607"`);
        await queryRunner.query(`DROP TABLE "permission"`);
    }

}

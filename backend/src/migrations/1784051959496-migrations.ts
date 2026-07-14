import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1784051959496 implements MigrationInterface {
  name = "Migrations1784051959496";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "role" text NOT NULL DEFAULT ('user'), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "villages" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "district" text NOT NULL, "taluka" text NOT NULL, "state" text NOT NULL, "pincode" varchar(10), "latitude" decimal(10,8), "longitude" decimal(11,8), "population" integer, "area_sq_km" decimal(10,2), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by_user_id" integer)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_VILLAGE_UNIQUE" ON "villages" ("name", "district", "taluka", "state") `,
    );
    await queryRunner.query(
      `CREATE TABLE "village_gallery_images" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" text NOT NULL, "description" text, "storage_key" text NOT NULL, "mime_type" text, "size_bytes" integer NOT NULL DEFAULT (0), "sort_order" integer NOT NULL DEFAULT (0), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "villageId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_VILLAGE_GALLERY_VILLAGE" ON "village_gallery_images" ("title") `,
    );
    await queryRunner.query(
      `CREATE TABLE "refresh-tokens" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_updates" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" text NOT NULL, "description" text, "update_date" date NOT NULL, "progress_percentage" integer NOT NULL DEFAULT (0), "status_after_update" text NOT NULL DEFAULT ('planned'), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "projectId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_PROJECT_UPDATE_PROJECT" ON "project_updates" ("title") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_documents" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" text NOT NULL, "description" text, "storage_key" text NOT NULL, "mime_type" text, "size_bytes" integer NOT NULL DEFAULT (0), "document_type" text, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "projectId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_PROJECT_DOCUMENT_PROJECT" ON "project_documents" ("title") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_images" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" text NOT NULL, "description" text, "storage_key" text NOT NULL, "mime_type" text, "size_bytes" integer NOT NULL DEFAULT (0), "sort_order" integer NOT NULL DEFAULT (0), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "projectId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_PROJECT_IMAGE_PROJECT" ON "project_images" ("title") `,
    );
    await queryRunner.query(
      `CREATE TABLE "facilities" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "description" text, "type" text NOT NULL DEFAULT ('other'), "is_active" boolean NOT NULL DEFAULT (1), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "villageId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_FACILITY_VILLAGE_TYPE" ON "facilities" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "development_projects" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "category" text NOT NULL DEFAULT ('other'), "description" text, "status" text NOT NULL DEFAULT ('planned'), "approval_date" date, "start_date" date, "expected_completion_date" date, "actual_completion_date" date, "allocated_budget" decimal(12,2) NOT NULL DEFAULT (0), "spent_budget" decimal(12,2) NOT NULL DEFAULT (0), "progress_percentage" integer NOT NULL DEFAULT (0), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "villageId" integer NOT NULL, "departmentId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_PROJECT_VILLAGE" ON "development_projects" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "departments" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "description" text, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_DEPARTMENT_NAME" ON "departments" ("name") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_VILLAGE_UNIQUE"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_villages" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "district" text NOT NULL, "taluka" text NOT NULL, "state" text NOT NULL, "pincode" varchar(10), "latitude" decimal(10,8), "longitude" decimal(11,8), "population" integer, "area_sq_km" decimal(10,2), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by_user_id" integer, CONSTRAINT "FK_31072b37c29e59e2290a715f9ed" FOREIGN KEY ("created_by_user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_villages"("id", "name", "district", "taluka", "state", "pincode", "latitude", "longitude", "population", "area_sq_km", "created_at", "updated_at", "deleted_at", "created_by_user_id") SELECT "id", "name", "district", "taluka", "state", "pincode", "latitude", "longitude", "population", "area_sq_km", "created_at", "updated_at", "deleted_at", "created_by_user_id" FROM "villages"`,
    );
    await queryRunner.query(`DROP TABLE "villages"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_villages" RENAME TO "villages"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_VILLAGE_UNIQUE" ON "villages" ("name", "district", "taluka", "state") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_VILLAGE_GALLERY_VILLAGE"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_village_gallery_images" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" text NOT NULL, "description" text, "storage_key" text NOT NULL, "mime_type" text, "size_bytes" integer NOT NULL DEFAULT (0), "sort_order" integer NOT NULL DEFAULT (0), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "villageId" integer NOT NULL, CONSTRAINT "FK_d7e48e1e0e34f4796e828903cf4" FOREIGN KEY ("villageId") REFERENCES "villages" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_village_gallery_images"("id", "title", "description", "storage_key", "mime_type", "size_bytes", "sort_order", "created_at", "updated_at", "villageId") SELECT "id", "title", "description", "storage_key", "mime_type", "size_bytes", "sort_order", "created_at", "updated_at", "villageId" FROM "village_gallery_images"`,
    );
    await queryRunner.query(`DROP TABLE "village_gallery_images"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_village_gallery_images" RENAME TO "village_gallery_images"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_VILLAGE_GALLERY_VILLAGE" ON "village_gallery_images" ("title") `,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_refresh-tokens" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer, CONSTRAINT "FK_88bd85554c3fa712cd505ec7b1b" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_refresh-tokens"("id", "created_at", "updated_at", "userId") SELECT "id", "created_at", "updated_at", "userId" FROM "refresh-tokens"`,
    );
    await queryRunner.query(`DROP TABLE "refresh-tokens"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_refresh-tokens" RENAME TO "refresh-tokens"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_PROJECT_UPDATE_PROJECT"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_project_updates" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" text NOT NULL, "description" text, "update_date" date NOT NULL, "progress_percentage" integer NOT NULL DEFAULT (0), "status_after_update" text NOT NULL DEFAULT ('planned'), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "projectId" integer NOT NULL, CONSTRAINT "FK_9eb8470a1333d4a546db555a012" FOREIGN KEY ("projectId") REFERENCES "development_projects" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_project_updates"("id", "title", "description", "update_date", "progress_percentage", "status_after_update", "created_at", "updated_at", "projectId") SELECT "id", "title", "description", "update_date", "progress_percentage", "status_after_update", "created_at", "updated_at", "projectId" FROM "project_updates"`,
    );
    await queryRunner.query(`DROP TABLE "project_updates"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_project_updates" RENAME TO "project_updates"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_PROJECT_UPDATE_PROJECT" ON "project_updates" ("title") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_PROJECT_DOCUMENT_PROJECT"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_project_documents" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" text NOT NULL, "description" text, "storage_key" text NOT NULL, "mime_type" text, "size_bytes" integer NOT NULL DEFAULT (0), "document_type" text, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "projectId" integer NOT NULL, CONSTRAINT "FK_f45c0dc27313262f03ef705df1d" FOREIGN KEY ("projectId") REFERENCES "development_projects" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_project_documents"("id", "title", "description", "storage_key", "mime_type", "size_bytes", "document_type", "created_at", "updated_at", "projectId") SELECT "id", "title", "description", "storage_key", "mime_type", "size_bytes", "document_type", "created_at", "updated_at", "projectId" FROM "project_documents"`,
    );
    await queryRunner.query(`DROP TABLE "project_documents"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_project_documents" RENAME TO "project_documents"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_PROJECT_DOCUMENT_PROJECT" ON "project_documents" ("title") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_PROJECT_IMAGE_PROJECT"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_project_images" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" text NOT NULL, "description" text, "storage_key" text NOT NULL, "mime_type" text, "size_bytes" integer NOT NULL DEFAULT (0), "sort_order" integer NOT NULL DEFAULT (0), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "projectId" integer NOT NULL, CONSTRAINT "FK_a6efe5710e20ed5469e7719f074" FOREIGN KEY ("projectId") REFERENCES "development_projects" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_project_images"("id", "title", "description", "storage_key", "mime_type", "size_bytes", "sort_order", "created_at", "updated_at", "projectId") SELECT "id", "title", "description", "storage_key", "mime_type", "size_bytes", "sort_order", "created_at", "updated_at", "projectId" FROM "project_images"`,
    );
    await queryRunner.query(`DROP TABLE "project_images"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_project_images" RENAME TO "project_images"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_PROJECT_IMAGE_PROJECT" ON "project_images" ("title") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_FACILITY_VILLAGE_TYPE"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_facilities" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "description" text, "type" text NOT NULL DEFAULT ('other'), "is_active" boolean NOT NULL DEFAULT (1), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "villageId" integer NOT NULL, CONSTRAINT "FK_2729cbf81a8e2dfe6e9ad9bddb5" FOREIGN KEY ("villageId") REFERENCES "villages" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_facilities"("id", "name", "description", "type", "is_active", "created_at", "updated_at", "deleted_at", "villageId") SELECT "id", "name", "description", "type", "is_active", "created_at", "updated_at", "deleted_at", "villageId" FROM "facilities"`,
    );
    await queryRunner.query(`DROP TABLE "facilities"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_facilities" RENAME TO "facilities"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_FACILITY_VILLAGE_TYPE" ON "facilities" ("name") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_PROJECT_VILLAGE"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_development_projects" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "category" text NOT NULL DEFAULT ('other'), "description" text, "status" text NOT NULL DEFAULT ('planned'), "approval_date" date, "start_date" date, "expected_completion_date" date, "actual_completion_date" date, "allocated_budget" decimal(12,2) NOT NULL DEFAULT (0), "spent_budget" decimal(12,2) NOT NULL DEFAULT (0), "progress_percentage" integer NOT NULL DEFAULT (0), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "villageId" integer NOT NULL, "departmentId" integer NOT NULL, CONSTRAINT "FK_f5395ce7c52b16e6f196f74477e" FOREIGN KEY ("villageId") REFERENCES "villages" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_ec9a80ba708b19a8a5ff775f629" FOREIGN KEY ("departmentId") REFERENCES "departments" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_development_projects"("id", "name", "category", "description", "status", "approval_date", "start_date", "expected_completion_date", "actual_completion_date", "allocated_budget", "spent_budget", "progress_percentage", "created_at", "updated_at", "deleted_at", "villageId", "departmentId") SELECT "id", "name", "category", "description", "status", "approval_date", "start_date", "expected_completion_date", "actual_completion_date", "allocated_budget", "spent_budget", "progress_percentage", "created_at", "updated_at", "deleted_at", "villageId", "departmentId" FROM "development_projects"`,
    );
    await queryRunner.query(`DROP TABLE "development_projects"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_development_projects" RENAME TO "development_projects"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_PROJECT_VILLAGE" ON "development_projects" ("name") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_PROJECT_VILLAGE"`);
    await queryRunner.query(
      `ALTER TABLE "development_projects" RENAME TO "temporary_development_projects"`,
    );
    await queryRunner.query(
      `CREATE TABLE "development_projects" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "category" text NOT NULL DEFAULT ('other'), "description" text, "status" text NOT NULL DEFAULT ('planned'), "approval_date" date, "start_date" date, "expected_completion_date" date, "actual_completion_date" date, "allocated_budget" decimal(12,2) NOT NULL DEFAULT (0), "spent_budget" decimal(12,2) NOT NULL DEFAULT (0), "progress_percentage" integer NOT NULL DEFAULT (0), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "villageId" integer NOT NULL, "departmentId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "development_projects"("id", "name", "category", "description", "status", "approval_date", "start_date", "expected_completion_date", "actual_completion_date", "allocated_budget", "spent_budget", "progress_percentage", "created_at", "updated_at", "deleted_at", "villageId", "departmentId") SELECT "id", "name", "category", "description", "status", "approval_date", "start_date", "expected_completion_date", "actual_completion_date", "allocated_budget", "spent_budget", "progress_percentage", "created_at", "updated_at", "deleted_at", "villageId", "departmentId" FROM "temporary_development_projects"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_development_projects"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_PROJECT_VILLAGE" ON "development_projects" ("name") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_FACILITY_VILLAGE_TYPE"`);
    await queryRunner.query(
      `ALTER TABLE "facilities" RENAME TO "temporary_facilities"`,
    );
    await queryRunner.query(
      `CREATE TABLE "facilities" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "description" text, "type" text NOT NULL DEFAULT ('other'), "is_active" boolean NOT NULL DEFAULT (1), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "villageId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "facilities"("id", "name", "description", "type", "is_active", "created_at", "updated_at", "deleted_at", "villageId") SELECT "id", "name", "description", "type", "is_active", "created_at", "updated_at", "deleted_at", "villageId" FROM "temporary_facilities"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_facilities"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_FACILITY_VILLAGE_TYPE" ON "facilities" ("name") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_PROJECT_IMAGE_PROJECT"`);
    await queryRunner.query(
      `ALTER TABLE "project_images" RENAME TO "temporary_project_images"`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_images" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" text NOT NULL, "description" text, "storage_key" text NOT NULL, "mime_type" text, "size_bytes" integer NOT NULL DEFAULT (0), "sort_order" integer NOT NULL DEFAULT (0), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "projectId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "project_images"("id", "title", "description", "storage_key", "mime_type", "size_bytes", "sort_order", "created_at", "updated_at", "projectId") SELECT "id", "title", "description", "storage_key", "mime_type", "size_bytes", "sort_order", "created_at", "updated_at", "projectId" FROM "temporary_project_images"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_project_images"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_PROJECT_IMAGE_PROJECT" ON "project_images" ("title") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_PROJECT_DOCUMENT_PROJECT"`);
    await queryRunner.query(
      `ALTER TABLE "project_documents" RENAME TO "temporary_project_documents"`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_documents" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" text NOT NULL, "description" text, "storage_key" text NOT NULL, "mime_type" text, "size_bytes" integer NOT NULL DEFAULT (0), "document_type" text, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "projectId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "project_documents"("id", "title", "description", "storage_key", "mime_type", "size_bytes", "document_type", "created_at", "updated_at", "projectId") SELECT "id", "title", "description", "storage_key", "mime_type", "size_bytes", "document_type", "created_at", "updated_at", "projectId" FROM "temporary_project_documents"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_project_documents"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_PROJECT_DOCUMENT_PROJECT" ON "project_documents" ("title") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_PROJECT_UPDATE_PROJECT"`);
    await queryRunner.query(
      `ALTER TABLE "project_updates" RENAME TO "temporary_project_updates"`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_updates" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" text NOT NULL, "description" text, "update_date" date NOT NULL, "progress_percentage" integer NOT NULL DEFAULT (0), "status_after_update" text NOT NULL DEFAULT ('planned'), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "projectId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "project_updates"("id", "title", "description", "update_date", "progress_percentage", "status_after_update", "created_at", "updated_at", "projectId") SELECT "id", "title", "description", "update_date", "progress_percentage", "status_after_update", "created_at", "updated_at", "projectId" FROM "temporary_project_updates"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_project_updates"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_PROJECT_UPDATE_PROJECT" ON "project_updates" ("title") `,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh-tokens" RENAME TO "temporary_refresh-tokens"`,
    );
    await queryRunner.query(
      `CREATE TABLE "refresh-tokens" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "refresh-tokens"("id", "created_at", "updated_at", "userId") SELECT "id", "created_at", "updated_at", "userId" FROM "temporary_refresh-tokens"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_refresh-tokens"`);
    await queryRunner.query(`DROP INDEX "IDX_VILLAGE_GALLERY_VILLAGE"`);
    await queryRunner.query(
      `ALTER TABLE "village_gallery_images" RENAME TO "temporary_village_gallery_images"`,
    );
    await queryRunner.query(
      `CREATE TABLE "village_gallery_images" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" text NOT NULL, "description" text, "storage_key" text NOT NULL, "mime_type" text, "size_bytes" integer NOT NULL DEFAULT (0), "sort_order" integer NOT NULL DEFAULT (0), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "villageId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "village_gallery_images"("id", "title", "description", "storage_key", "mime_type", "size_bytes", "sort_order", "created_at", "updated_at", "villageId") SELECT "id", "title", "description", "storage_key", "mime_type", "size_bytes", "sort_order", "created_at", "updated_at", "villageId" FROM "temporary_village_gallery_images"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_village_gallery_images"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_VILLAGE_GALLERY_VILLAGE" ON "village_gallery_images" ("title") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_VILLAGE_UNIQUE"`);
    await queryRunner.query(
      `ALTER TABLE "villages" RENAME TO "temporary_villages"`,
    );
    await queryRunner.query(
      `CREATE TABLE "villages" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "district" text NOT NULL, "taluka" text NOT NULL, "state" text NOT NULL, "pincode" varchar(10), "latitude" decimal(10,8), "longitude" decimal(11,8), "population" integer, "area_sq_km" decimal(10,2), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "created_by_user_id" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "villages"("id", "name", "district", "taluka", "state", "pincode", "latitude", "longitude", "population", "area_sq_km", "created_at", "updated_at", "deleted_at", "created_by_user_id") SELECT "id", "name", "district", "taluka", "state", "pincode", "latitude", "longitude", "population", "area_sq_km", "created_at", "updated_at", "deleted_at", "created_by_user_id" FROM "temporary_villages"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_villages"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_VILLAGE_UNIQUE" ON "villages" ("name", "district", "taluka", "state") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_DEPARTMENT_NAME"`);
    await queryRunner.query(`DROP TABLE "departments"`);
    await queryRunner.query(`DROP INDEX "IDX_PROJECT_VILLAGE"`);
    await queryRunner.query(`DROP TABLE "development_projects"`);
    await queryRunner.query(`DROP INDEX "IDX_FACILITY_VILLAGE_TYPE"`);
    await queryRunner.query(`DROP TABLE "facilities"`);
    await queryRunner.query(`DROP INDEX "IDX_PROJECT_IMAGE_PROJECT"`);
    await queryRunner.query(`DROP TABLE "project_images"`);
    await queryRunner.query(`DROP INDEX "IDX_PROJECT_DOCUMENT_PROJECT"`);
    await queryRunner.query(`DROP TABLE "project_documents"`);
    await queryRunner.query(`DROP INDEX "IDX_PROJECT_UPDATE_PROJECT"`);
    await queryRunner.query(`DROP TABLE "project_updates"`);
    await queryRunner.query(`DROP TABLE "refresh-tokens"`);
    await queryRunner.query(`DROP INDEX "IDX_VILLAGE_GALLERY_VILLAGE"`);
    await queryRunner.query(`DROP TABLE "village_gallery_images"`);
    await queryRunner.query(`DROP INDEX "IDX_VILLAGE_UNIQUE"`);
    await queryRunner.query(`DROP TABLE "villages"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}

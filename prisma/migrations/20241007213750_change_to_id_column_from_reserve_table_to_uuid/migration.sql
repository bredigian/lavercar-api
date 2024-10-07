/*
  Warnings:

  - The primary key for the `Reserve` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Reserve" DROP CONSTRAINT "Reserve_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Reserve_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Reserve_id_seq";

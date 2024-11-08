/*
  Warnings:

  - Added the required column `price` to the `Reserve` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reserve" DROP CONSTRAINT "Reserve_washing_id_fkey";

-- AlterTable
ALTER TABLE "Reserve" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "washing_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Reserve" ADD CONSTRAINT "Reserve_washing_id_fkey" FOREIGN KEY ("washing_id") REFERENCES "WashingType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - Added the required column `washing_id` to the `Reserve` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reserve" ADD COLUMN     "washing_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "WashinType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "WashinType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WashinType_id_key" ON "WashinType"("id");

-- AddForeignKey
ALTER TABLE "Reserve" ADD CONSTRAINT "Reserve_washing_id_fkey" FOREIGN KEY ("washing_id") REFERENCES "WashinType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `WashinType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reserve" DROP CONSTRAINT "Reserve_washing_id_fkey";

-- DropTable
DROP TABLE "WashinType";

-- CreateTable
CREATE TABLE "WashingType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "WashingType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WashingType_id_key" ON "WashingType"("id");

-- AddForeignKey
ALTER TABLE "Reserve" ADD CONSTRAINT "Reserve_washing_id_fkey" FOREIGN KEY ("washing_id") REFERENCES "WashingType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

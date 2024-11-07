/*
  Warnings:

  - A unique constraint covering the columns `[reserve_id]` on the table `Income` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Income_reserve_id_key" ON "Income"("reserve_id");

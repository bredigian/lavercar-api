/*
  Warnings:

  - A unique constraint covering the columns `[date]` on the table `Reserve` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reserve_date_key" ON "Reserve"("date");

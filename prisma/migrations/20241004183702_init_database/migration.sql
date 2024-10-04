-- CreateEnum
CREATE TYPE "RESERVE_STATUS" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PAYMENT_STATUS" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Reserve" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_phone" TEXT NOT NULL,
    "status" "RESERVE_STATUS" NOT NULL,
    "payment_status" "PAYMENT_STATUS" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reserve_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workhour" (
    "id" TEXT NOT NULL,
    "hour" INTEGER NOT NULL,
    "time" INTEGER NOT NULL,
    "weekday" INTEGER NOT NULL,

    CONSTRAINT "Workhour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reserve_id_key" ON "Reserve"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Workhour_id_key" ON "Workhour"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Log_id_key" ON "Log"("id");

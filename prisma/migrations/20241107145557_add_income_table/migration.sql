-- CreateTable
CREATE TABLE "Income" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" DOUBLE PRECISION NOT NULL,
    "reserve_id" TEXT NOT NULL,

    CONSTRAINT "Income_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Income_id_key" ON "Income"("id");

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_reserve_id_fkey" FOREIGN KEY ("reserve_id") REFERENCES "Reserve"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `payments_files_data` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "payments_files_data" DROP CONSTRAINT "payments_files_data_payment_file_id_fkey";

-- DropTable
DROP TABLE "payments_files_data";

-- CreateTable
CREATE TABLE "payment_files_data" (
    "id" UUID NOT NULL,
    "payment_file_id" UUID NOT NULL,
    "status" "StatusPaymentFile" NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "birth_date" DATE NOT NULL,
    "paid_amount" DECIMAL(15,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmed_at" TIMESTAMP(3),

    CONSTRAINT "payment_files_data_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "payment_files_data" ADD CONSTRAINT "payment_files_data_payment_file_id_fkey" FOREIGN KEY ("payment_file_id") REFERENCES "payment_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

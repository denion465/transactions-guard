-- AlterTable
ALTER TABLE "confirmed_payments" ALTER COLUMN "paid_amount" SET DATA TYPE DECIMAL(15,2);

-- AlterTable
ALTER TABLE "payments_files_data" ALTER COLUMN "paid_amount" SET DATA TYPE DECIMAL(15,2);

-- CreateEnum
CREATE TYPE "StatusPaymentFile" AS ENUM ('PENDING', 'CONFIRMED');

-- CreateTable
CREATE TABLE "payment_files" (
    "id" UUID NOT NULL,
    "file_name" TEXT NOT NULL,
    "status" "StatusPaymentFile" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmed_at" TIMESTAMP(3),

    CONSTRAINT "payment_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments_files_data" (
    "id" UUID NOT NULL,
    "payment_file_id" UUID NOT NULL,
    "status" "StatusPaymentFile" NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "paid_amount" DOUBLE PRECISION NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmed_at" TIMESTAMP(3),

    CONSTRAINT "payments_files_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "confirmed_payments" (
    "id" UUID NOT NULL,
    "payment_file_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "paid_amount" DOUBLE PRECISION NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "confirmed_payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "payments_files_data" ADD CONSTRAINT "payments_files_data_payment_file_id_fkey" FOREIGN KEY ("payment_file_id") REFERENCES "payment_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "confirmed_payments" ADD CONSTRAINT "confirmed_payments_payment_file_id_fkey" FOREIGN KEY ("payment_file_id") REFERENCES "payment_files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

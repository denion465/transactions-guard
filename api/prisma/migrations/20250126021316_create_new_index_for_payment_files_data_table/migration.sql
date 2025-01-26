-- CreateIndex
CREATE INDEX "payment_files_data_payment_file_id_status_id_idx" ON "payment_files_data"("payment_file_id", "status", "id" ASC);

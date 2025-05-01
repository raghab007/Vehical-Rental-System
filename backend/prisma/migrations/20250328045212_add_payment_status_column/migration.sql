/*
  Warnings:

  - Added the required column `amount` to the `Rental` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `rental` ADD COLUMN `amount` INTEGER NOT NULL,
    ADD COLUMN `paymentStatus` VARCHAR(191) NULL DEFAULT 'unpaid';

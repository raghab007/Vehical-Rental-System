/*
  Warnings:

  - Added the required column `available` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rented` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `vehicle` ADD COLUMN `available` INTEGER NOT NULL,
    ADD COLUMN `rented` INTEGER NOT NULL;

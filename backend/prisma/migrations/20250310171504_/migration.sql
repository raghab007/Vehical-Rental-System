-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` VARCHAR(191) NULL DEFAULT 'user';

-- CreateTable
CREATE TABLE `Vehicle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vehicleName` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NOT NULL,
    `fuelType` VARCHAR(191) NOT NULL,
    `passengerSeat` INTEGER NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `pricePerHour` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

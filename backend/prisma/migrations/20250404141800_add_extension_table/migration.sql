-- CreateTable
CREATE TABLE `RentalExtensionRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rentalId` INTEGER NOT NULL,
    `requestedEndTime` DATETIME(3) NOT NULL,
    `additionalAmount` INTEGER NOT NULL,
    `paymentStatus` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RentalExtensionRequest` ADD CONSTRAINT `RentalExtensionRequest_rentalId_fkey` FOREIGN KEY (`rentalId`) REFERENCES `Rental`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_subjectId_fkey`;

-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Subject` DROP FOREIGN KEY `Subject_forumId_fkey`;

-- AddForeignKey
ALTER TABLE `Subject` ADD CONSTRAINT `Subject_forumId_fkey` FOREIGN KEY (`forumId`) REFERENCES `Forum`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

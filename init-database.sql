-- Cadrart 2025 Database Initialization Script
-- Generated from migration: 1751955413397-cadrart.ts

-- Create tag table
CREATE TABLE `tag` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(50) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Create client table
CREATE TABLE `client` (
    `id` int NOT NULL AUTO_INCREMENT,
    `lastName` varchar(50) NOT NULL,
    `firstName` varchar(50) NOT NULL,
    `company` varchar(50) NULL,
    `address` varchar(255) NULL,
    `mail` varchar(150) NULL,
    `phone` varchar(20) NULL,
    `phone2` varchar(20) NULL,
    `vat` smallint NOT NULL DEFAULT '21',
    `reduction` decimal(5,2) NOT NULL DEFAULT '0.00',
    `tagId` int NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Create task table
CREATE TABLE `task` (
    `id` int NOT NULL AUTO_INCREMENT,
    `article` json NOT NULL,
    `comment` varchar(255) NULL,
    `total` decimal(8,2) NOT NULL,
    `totalBeforeReduction` decimal(8,2) NOT NULL,
    `totalWithVat` decimal(8,2) NOT NULL,
    `image` varchar(100) NULL,
    `doneCount` smallint NOT NULL DEFAULT '0',
    `jobId` int NULL,
    `parentId` int NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Create job table
CREATE TABLE `job` (
    `id` int NOT NULL AUTO_INCREMENT,
    `count` smallint NOT NULL DEFAULT '1',
    `orientation` enum ('0', '1') NOT NULL DEFAULT '0',
    `measure` enum ('0', '1', '2', '3') NOT NULL DEFAULT '0',
    `location` json NULL,
    `dueDate` date NULL,
    `startDate` date NULL,
    `openingWidth` decimal(7,2) NOT NULL DEFAULT '0.00',
    `openingHeight` decimal(7,2) NOT NULL DEFAULT '0.00',
    `marginWidth` decimal(7,2) NOT NULL DEFAULT '0.00',
    `marginHeight` decimal(7,2) NOT NULL DEFAULT '0.00',
    `glassWidth` decimal(7,2) NOT NULL DEFAULT '0.00',
    `glassHeight` decimal(7,2) NOT NULL DEFAULT '0.00',
    `description` varchar(255) NULL,
    `image` varchar(100) NULL,
    `total` decimal(8,2) NOT NULL DEFAULT '0.00',
    `totalBeforeReduction` decimal(8,2) NOT NULL DEFAULT '0.00',
    `totalWithVat` decimal(8,2) NOT NULL DEFAULT '0.00',
    `offerId` int NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Create offer table
CREATE TABLE `offer` (
    `id` int NOT NULL AUTO_INCREMENT,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `number` varchar(50) NOT NULL,
    `client` json NOT NULL,
    `assignedTo` json NULL,
    `status` enum ('0', '1', '2') NOT NULL DEFAULT '0',
    `adjustedReduction` decimal(5,2) NULL,
    `adjustedVat` decimal(5,2) NULL,
    `total` decimal(8,2) NOT NULL DEFAULT '0.00',
    `totalBeforeReduction` decimal(8,2) NOT NULL DEFAULT '0.00',
    `totalWithVat` decimal(8,2) NOT NULL DEFAULT '0.00',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Create team_member table
CREATE TABLE `team_member` (
    `id` int NOT NULL AUTO_INCREMENT,
    `lastName` varchar(50) NOT NULL,
    `firstName` varchar(50) NOT NULL,
    `address` varchar(255) NULL,
    `mail` varchar(150) NOT NULL,
    `phone` varchar(20) NULL,
    `password` varchar(255) NOT NULL,
    `image` varchar(20) NULL DEFAULT 'default',
    UNIQUE INDEX `IDX_3c9d4dd15cbf49fce472473722` (`mail`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Create formula table
CREATE TABLE `formula` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(50) NOT NULL,
    `formula` varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Create provider table
CREATE TABLE `provider` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL,
    `address` varchar(255) NULL,
    `vat` varchar(25) NULL,
    `iban` varchar(34) NULL,
    `mail` varchar(150) NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Create article table
CREATE TABLE `article` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL,
    `place` varchar(50) NULL,
    `buyPrice` decimal(7,2) NULL,
    `sellPrice` decimal(7,2) NULL,
    `getPriceMethod` enum ('0', '1', '2') NOT NULL DEFAULT '0',
    `family` enum ('0', '1', '2', '3', '4') NOT NULL DEFAULT '3',
    `maxReduction` decimal(5,2) NULL DEFAULT '100.00',
    `providerRef` varchar(50) NULL,
    `maxLength` decimal(7,2) NULL,
    `maxWidth` decimal(7,2) NULL,
    `combine` tinyint NOT NULL DEFAULT 0,
    `providerId` int NULL,
    `formulaId` int NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Create stock table
CREATE TABLE `stock` (
    `id` int NOT NULL AUTO_INCREMENT,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `articleName` varchar(100) NULL,
    `orderDate` date NULL,
    `deliveryDate` date NULL,
    `articleId` int NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Create location table
CREATE TABLE `location` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(50) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Add foreign key constraints
ALTER TABLE `client` ADD CONSTRAINT `FK_b1b843ae9a9473f944fd743e413` FOREIGN KEY (`tagId`) REFERENCES `tag`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `task` ADD CONSTRAINT `FK_53ed44c9efb278a60ae56a8bf77` FOREIGN KEY (`jobId`) REFERENCES `job`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `task` ADD CONSTRAINT `FK_8c9920b5fb32c3d8453f64b705c` FOREIGN KEY (`parentId`) REFERENCES `task`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `job` ADD CONSTRAINT `FK_5c854db61b2a737038a603c3b81` FOREIGN KEY (`offerId`) REFERENCES `offer`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `article` ADD CONSTRAINT `FK_0e00addaebad8979b2fb171166a` FOREIGN KEY (`providerId`) REFERENCES `provider`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `article` ADD CONSTRAINT `FK_cda3e0f2cc2c833dfb4067b4c08` FOREIGN KEY (`formulaId`) REFERENCES `formula`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `stock` ADD CONSTRAINT `FK_6d2723324796e85ecade9ccf5aa` FOREIGN KEY (`articleId`) REFERENCES `article`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

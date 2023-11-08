-- Create Database
DROP DATABASE IF EXISTS `fiverr_db`;
CREATE DATABASE IF NOT EXISTS `fiverr_db`;
USE fiverr_db;

-- Table user
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
    `id` BINARY(16),
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    CHECK (email REGEXP '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'),
    `password` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(10) NOT NULL UNIQUE,
    `birthday` DATETIME NOT NULL,
    `gender` VARCHAR(10) NOT NULL,
    `role` VARCHAR(255) NOT NULL,
    `skill` VARCHAR(255) NOT NULL,
    `certification` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
);

-- Table job_type
DROP TABLE IF EXISTS `job_type`;
CREATE TABLE `job_type` (
    `id` BINARY(16),
    `name_type` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
);

-- Table job_type_details
DROP TABLE IF EXISTS `job_type_details`;
CREATE TABLE `job_type_details` (
    `id` BINARY(16),
    `name_detail` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) NOT NULL,
    `jt_id` BINARY(16),
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_jtd_jt` FOREIGN KEY (`jt_id`)
        REFERENCES `job_type` (`id`)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- Table job
DROP TABLE IF EXISTS `job`;
CREATE TABLE `job` (
    `id` BINARY(16),
    `job_name` VARCHAR(255) NOT NULL,
    `rate_amount` INT NOT NULL CHECK (rate_amount >= 0),
    `price` INT NOT NULL CHECK (price >= 0),
    `image` VARCHAR(255) NOT NULL,
    `desc` VARCHAR(255) DEFAULT 'No Description',
    `short_desc` VARCHAR(255) DEFAULT 'No Description',
    `job_rate` INT NOT NULL CHECK (job_rate > 0 && job_rate <= 5),
    `user_id` BINARY(16),
    `jtd_id` BINARY(16),
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_job_user` FOREIGN KEY (`user_id`)
        REFERENCES `user` (`id`)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `fk_job_jtd` FOREIGN KEY (`jtd_id`)
        REFERENCES `job_type_details` (`id`)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- Table job_rental
DROP TABLE IF EXISTS `job_rental`;
CREATE TABLE `job_rental` (
    `id` BINARY(16),
    `date_rent` DATETIME DEFAULT NOW(),
    `is_finish` BOOLEAN NOT NULL,
    `job_id` BINARY(16),
    `user_id` BINARY(16),
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_jr_job` FOREIGN KEY (`job_id`)
        REFERENCES `job` (`id`)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `fk_jr_user` FOREIGN KEY (`user_id`)
        REFERENCES `user` (`id`)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- Table comment
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
    `id` BINARY(16),
    `date_comment` DATETIME DEFAULT NOW(),
    `content` TEXT NOT NULL,
    `comment_rate` INT NOT NULL CHECK (comment_rate > 0 && comment_rate <= 5),
    `job_id` BINARY(16),
    `user_id` BINARY(16),
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_comment_job` FOREIGN KEY (`job_id`)
        REFERENCES `job` (`id`)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `fk_comment_user` FOREIGN KEY (`user_id`)
        REFERENCES `user` (`id`)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- Chèn dữ liệu cho bảng user
INSERT INTO `user` (`id`, `name`, `email`, `password`, `phone`, `birthday`, `gender`, `role`, `skill`, `certification`) VALUES
(UUID_TO_BIN(UUID()), 'User1', 'user1@example.com', 'password1', '1234567890', '1990-01-01', 'Male', 'Role1', 'Skill1', 'Certification1'),
(UUID_TO_BIN(UUID()), 'User2', 'user2@example.com', 'password2', '9876543210', '1995-02-15', 'Female', 'Role2', 'Skill2', 'Certification2'),
(UUID_TO_BIN(UUID()), 'User3', 'user3@example.com', 'password3', '1112223333', '1985-11-10', 'Male', 'Role3', 'Skill3', 'Certification3');

-- Chèn dữ liệu cho bảng job_type
INSERT INTO `job_type` (`id`, `name_type`) VALUES
(UUID_TO_BIN(UUID()), 'Type1'),
(UUID_TO_BIN(UUID()), 'Type2'),
(UUID_TO_BIN(UUID()), 'Type3');

-- Chèn dữ liệu cho bảng job_type_details
INSERT INTO `job_type_details` (`id`, `name_detail`, `image`, `jt_id`) VALUES
(UUID_TO_BIN(UUID()), 'Detail1', 'image1.jpg', (SELECT `id` FROM `job_type` WHERE `name_type` = 'Type1')),
(UUID_TO_BIN(UUID()), 'Detail2', 'image2.jpg', (SELECT `id` FROM `job_type` WHERE `name_type` = 'Type2')),
(UUID_TO_BIN(UUID()), 'Detail3', 'image3.jpg', (SELECT `id` FROM `job_type` WHERE `name_type` = 'Type3'));

-- Chèn dữ liệu cho bảng job
INSERT INTO `job` (`id`, `job_name`, `rate_amount`, `price`, `image`, `desc`, `short_desc`, `job_rate`, `user_id`, `jtd_id`) VALUES
(UUID_TO_BIN(UUID()), 'Job1', 1, 100, 'job1.jpg', 'Description 1', 'Short description 1', 5, (SELECT `id` FROM `user` WHERE `name` = 'User1'), (SELECT `id` FROM `job_type_details` WHERE `name_detail` = 'Detail1')),
(UUID_TO_BIN(UUID()), 'Job2', 1, 50, 'job2.jpg', 'Description 2', 'Short description 2', 4, (SELECT `id` FROM `user` WHERE `name` = 'User2'), (SELECT `id` FROM `job_type_details` WHERE `name_detail` = 'Detail2')),
(UUID_TO_BIN(UUID()), 'Job3', 1, 75, 'job3.jpg', 'Description 3', 'Short description 3', 3, (SELECT `id` FROM `user` WHERE `name` = 'User3'), (SELECT `id` FROM `job_type_details` WHERE `name_detail` = 'Detail3'));

-- Chèn dữ liệu cho bảng job_rental
INSERT INTO `job_rental` (`id`, `is_finish`, `job_id`, `user_id`) VALUES
(UUID_TO_BIN(UUID()), 1, (SELECT `id` FROM `job` WHERE `job_name` = 'Job1'), (SELECT `id` FROM `user` WHERE `name` = 'User1')),
(UUID_TO_BIN(UUID()), 0, (SELECT `id` FROM `job` WHERE `job_name` = 'Job2'), (SELECT `id` FROM `user` WHERE `name` = 'User2')),
(UUID_TO_BIN(UUID()), 1, (SELECT `id` FROM `job` WHERE `job_name` = 'Job3'), (SELECT `id` FROM `user` WHERE `name` = 'User3'));

-- Chèn dữ liệu cho bảng comment
INSERT INTO `comment` (`id`, `content`, `comment_rate`, `job_id`, `user_id`) VALUES
(UUID_TO_BIN(UUID()), 'Comment 1', 5, (SELECT `id` FROM `job` WHERE `job_name` = 'Job1'), (SELECT `id` FROM `user` WHERE `name` = 'User1')),
(UUID_TO_BIN(UUID()), 'Comment 2', 4, (SELECT `id` FROM `job` WHERE `job_name` = 'Job2'), (SELECT `id` FROM `user` WHERE `name` = 'User2')),
(UUID_TO_BIN(UUID()), 'Comment 3', 3, (SELECT `id` FROM `job` WHERE `job_name` = 'Job3'), (SELECT `id` FROM `user` WHERE `name` = 'User3'));
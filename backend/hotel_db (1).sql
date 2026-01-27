-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 29, 2026 at 12:18 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hotel_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `app_user`
--

CREATE TABLE `app_user` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `app_user`
--

INSERT INTO `app_user` (`id`, `email`, `password`, `role`, `username`) VALUES
(1, 'admin@hotel.com', 'password', 'ADMIN', 'admin'),
(2, 'manager@hotel.com', 'password', 'MANAGER', 'manager'),
(3, 'guest@hotel.com', 'password', 'GUEST', 'guest'),
(4, 'john.d@example.com', 'password', 'GUEST', 'john_doe'),
(5, 'jane.s@example.com', 'password', 'GUEST', 'jane_smith'),
(6, 'mike.r@pearman.com', 'password', 'GUEST', 'mike_ross'),
(7, 'rachel.z@pearman.com', 'password', 'GUEST', 'rachel_zane'),
(8, 'harvey@specter.com', 'password', 'GUEST', 'harvey_specter'),
(9, 'louis@litt.com', 'password', 'GUEST', 'louis_litt'),
(10, 'donna@expert.com', 'password', 'GUEST', 'donna_paulsen'),
(11, 'jessica@pearman.com', 'password', 'GUEST', 'jessica_pearson'),
(12, 'alex.w@pearman.com', 'password', 'GUEST', 'alex_williams'),
(13, 'katrina.b@pearman.com', 'password', 'GUEST', 'katrina_bennett'),
(14, 'robert.z@randk.com', 'password', 'GUEST', 'robert_zane'),
(15, 'samantha.w@pearman.com', 'password', 'GUEST', 'samantha_wheeler');

-- --------------------------------------------------------

--
-- Table structure for table `bill`
--

CREATE TABLE `bill` (
  `id` bigint(20) NOT NULL,
  `amount` decimal(38,2) DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `issue_date` date DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `booking_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bill`
--

INSERT INTO `bill` (`id`, `amount`, `due_date`, `issue_date`, `payment_date`, `payment_method`, `status`, `booking_id`) VALUES
(1, 2025.00, '2026-02-05', '2026-01-29', NULL, NULL, 'PENDING', 11),
(2, 2025.00, '2026-02-05', '2026-01-29', '2026-01-29', 'ONLINE', 'PAID', 10);

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `id` bigint(20) NOT NULL,
  `check_in_date` date DEFAULT NULL,
  `check_out_date` date DEFAULT NULL,
  `coupon_code` varchar(255) DEFAULT NULL,
  `customer_age` int(11) DEFAULT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `customer_phone` varchar(255) DEFAULT NULL,
  `is_checked_in` bit(1) NOT NULL,
  `is_checked_out` bit(1) NOT NULL,
  `total_cost` decimal(38,2) DEFAULT NULL,
  `room_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`id`, `check_in_date`, `check_out_date`, `coupon_code`, `customer_age`, `customer_email`, `customer_name`, `customer_phone`, `is_checked_in`, `is_checked_out`, `total_cost`, `room_id`, `user_id`) VALUES
(1, '2026-01-14', '2026-01-24', NULL, NULL, 'john.d@example.com', 'john_doe', NULL, b'1', b'1', 850.00, 1, 4),
(2, '2026-01-19', '2026-01-24', NULL, NULL, 'mike.r@pearman.com', 'mike_ross', NULL, b'1', b'1', 1100.00, 9, 6),
(3, '2026-01-21', '2026-01-24', NULL, NULL, 'louis@litt.com', 'louis_litt', NULL, b'1', b'1', 390.00, 3, 9),
(4, '2026-01-22', '2026-01-24', NULL, NULL, 'harvey@specter.com', 'harvey_specter', NULL, b'1', b'1', 2400.00, 18, 8),
(5, '2026-01-20', '2026-01-24', NULL, NULL, 'donna@expert.com', 'donna_paulsen', NULL, b'1', b'1', 720.00, 7, 10),
(6, '2026-01-28', '2026-01-31', NULL, NULL, 'jane.s@example.com', 'jane_smith', NULL, b'1', b'0', 360.00, 2, 5),
(7, '2026-01-28', '2026-01-31', NULL, NULL, 'rachel.z@pearman.com', 'rachel_zane', NULL, b'1', b'0', 570.00, 11, 7),
(8, '2026-01-28', '2026-01-31', NULL, NULL, 'jessica@pearman.com', 'jessica_pearson', NULL, b'1', b'0', 1350.00, 15, 11),
(9, '2026-01-28', '2026-01-31', NULL, NULL, 'alex.w@pearman.com', 'alex_williams', NULL, b'1', b'0', 4500.00, 19, 12),
(10, '2026-01-29', '2026-02-02', 'VIP50', NULL, 'guest@hotel.com', 'guest', NULL, b'1', b'1', 2025.00, 20, 3);

-- --------------------------------------------------------

--
-- Table structure for table `coupon`
--

CREATE TABLE `coupon` (
  `id` bigint(20) NOT NULL,
  `code` varchar(255) NOT NULL,
  `discount_percentage` int(11) NOT NULL,
  `expiry_date` date DEFAULT NULL,
  `is_active` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coupon`
--

INSERT INTO `coupon` (`id`, `code`, `discount_percentage`, `expiry_date`, `is_active`) VALUES
(1, 'WELCOME10', 10, '2026-07-29', b'1'),
(2, 'SUMMER20', 20, '2026-04-29', b'1'),
(3, 'VIP50', 50, '2027-01-29', b'1'),
(4, 'FLASHDEAL', 30, '2026-01-31', b'1'),
(5, 'EXPIRED5', 5, '2026-01-28', b'0');

-- --------------------------------------------------------

--
-- Table structure for table `maintenance_ticket`
--

CREATE TABLE `maintenance_ticket` (
  `id` bigint(20) NOT NULL,
  `issue_description` varchar(255) DEFAULT NULL,
  `priority` varchar(255) DEFAULT NULL,
  `reported_at` datetime(6) DEFAULT NULL,
  `resolved_at` datetime(6) DEFAULT NULL,
  `room_number` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `maintenance_ticket`
--

INSERT INTO `maintenance_ticket` (`id`, `issue_description`, `priority`, `reported_at`, `resolved_at`, `room_number`, `status`) VALUES
(1, 'AC leaking', 'HIGH', '2026-01-29 15:52:47.000000', NULL, '204', 'OPEN'),
(2, 'Remote missing', 'LOW', '2026-01-29 15:52:47.000000', NULL, '104', 'OPEN'),
(3, 'Pool filter check', 'MEDIUM', '2026-01-29 15:52:47.000000', NULL, '402', 'OPEN');

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `id` bigint(20) NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `rating` int(11) NOT NULL,
  `room_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `review`
--

INSERT INTO `review` (`id`, `comment`, `customer_name`, `rating`, `room_id`) VALUES
(1, 'Great stay!', 'john_doe', 5, 1),
(2, 'Unbelievable view.', 'mike_ross', 5, 9),
(3, 'Decent but simple.', 'louis_litt', 3, 3),
(4, 'World class service.', 'harvey_specter', 5, 18),
(5, 'Loved the amenities.', 'donna_paulsen', 4, 7),
(6, 'ok', 'guest', 3, 20);

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

CREATE TABLE `room` (
  `id` bigint(20) NOT NULL,
  `deleted` bit(1) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `price_per_night` decimal(38,2) DEFAULT NULL,
  `room_number` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room`
--

INSERT INTO `room` (`id`, `deleted`, `description`, `image_url`, `price_per_night`, `room_number`, `status`, `type`) VALUES
(1, b'0', 'Perfect for solo travelers.', '/images/rooms/single.jpg', 85.00, '101', 'AVAILABLE', 'Cozy Single'),
(2, b'0', 'Comfortable queen bed.', '/images/rooms/queen.jpg', 120.00, '102', 'OCCUPIED', 'Standard Queen'),
(3, b'0', 'Two twin beds, city views.', '/images/rooms/twin.jpg', 130.00, '103', 'AVAILABLE', 'Standard Twin'),
(4, b'0', 'ADA compliant room.', '/images/rooms/accessible.jpg', 120.00, '104', 'AVAILABLE', 'Accessible Queen'),
(5, b'0', 'Spacious king bed.', '/images/rooms/deluxe.jpg', 140.00, '105', 'AVAILABLE', 'Standard King'),
(6, b'0', 'Minimalist and affordable.', '/images/rooms/single.jpg', 70.00, '106', 'AVAILABLE', 'Budget Single'),
(7, b'0', 'King bed, seating area.', '/images/rooms/deluxe.jpg', 180.00, '201', 'AVAILABLE', 'Deluxe King'),
(8, b'0', 'Overlooking gardens.', '/images/rooms/garden.jpg', 190.00, '202', 'AVAILABLE', 'Garden View Deluxe'),
(9, b'0', 'Stunning ocean views.', '/images/rooms/ocean.jpg', 220.00, '203', 'AVAILABLE', 'Ocean View King'),
(10, b'0', 'Panoramic windows.', '/images/rooms/executive.jpg', 240.00, '204', 'AVAILABLE', 'Executive Corner'),
(11, b'0', 'Premium two-bed room.', '/images/rooms/twin.jpg', 190.00, '205', 'OCCUPIED', 'Deluxe Twin'),
(12, b'0', 'Private outdoor terrace.', '/images/rooms/garden.jpg', 210.00, '206', 'AVAILABLE', 'Terrace King'),
(13, b'0', 'Open-plan suite.', '/images/rooms/suite_junior.jpg', 350.00, '301', 'AVAILABLE', 'Junior Suite'),
(14, b'0', 'Two bedrooms, kitchenette.', '/images/rooms/twin.jpg', 400.00, '302', 'AVAILABLE', 'Family Suite'),
(15, b'0', 'Jacuzzi, four-poster bed.', '/images/rooms/suite_honey.jpg', 450.00, '303', 'OCCUPIED', 'Honeymoon Suite'),
(16, b'0', 'Meeting area.', '/images/rooms/executive.jpg', 380.00, '304', 'AVAILABLE', 'Business Suite'),
(17, b'0', 'Dual-aspect views.', '/images/rooms/suite_junior.jpg', 320.00, '305', 'AVAILABLE', 'Corner Suite'),
(18, b'0', 'Private dining, butler.', '/images/rooms/luxury.jpg', 1200.00, '401', 'AVAILABLE', 'Presidential Suite'),
(19, b'0', 'Infinity pool.', '/images/rooms/luxury.jpg', 1500.00, '402', 'OCCUPIED', 'Royal Penthouse'),
(20, b'0', 'VIP luxury experience.', '/images/rooms/luxury.jpg', 900.00, '403', 'DIRTY', 'Ambassador Suite');

-- --------------------------------------------------------

--
-- Table structure for table `service_request`
--

CREATE TABLE `service_request` (
  `id` bigint(20) NOT NULL,
  `cost` decimal(38,2) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `room_number` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `request_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_request`
--

INSERT INTO `service_request` (`id`, `cost`, `description`, `room_number`, `status`, `type`, `request_date`) VALUES
(1, 20.00, 'Burger and Coke', '102', 'PENDING', 'FOOD', '2026-01-29'),
(2, 0.00, 'Extra towels', '204', 'COMPLETED', 'CLEANING', '2026-01-29'),
(3, 50.00, 'Taxi to Airport', '303', 'PENDING', 'TRANSPORT', '2026-01-29'),
(4, 0.00, 'Trip Plan Request: tnx', 'N/A', 'COMPLETED', 'TRIP', '2026-01-29');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `app_user`
--
ALTER TABLE `app_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_3k4cplvh82srueuttfkwnylq0` (`username`);

--
-- Indexes for table `bill`
--
ALTER TABLE `bill`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_aejjhps06kp1govmocb1qd3mw` (`booking_id`);

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKq83pan5xy2a6rn0qsl9bckqai` (`room_id`),
  ADD KEY `FKn7phgawjwo673xgim9d2cvfe1` (`user_id`);

--
-- Indexes for table `coupon`
--
ALTER TABLE `coupon`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_bg4p9ontpj7adq7yr71h93sdn` (`code`);

--
-- Indexes for table `maintenance_ticket`
--
ALTER TABLE `maintenance_ticket`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKewf90irce1ialx2d8ydumyeg7` (`room_id`);

--
-- Indexes for table `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service_request`
--
ALTER TABLE `service_request`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `app_user`
--
ALTER TABLE `app_user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `bill`
--
ALTER TABLE `bill`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `coupon`
--
ALTER TABLE `coupon`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `maintenance_ticket`
--
ALTER TABLE `maintenance_ticket`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `room`
--
ALTER TABLE `room`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `service_request`
--
ALTER TABLE `service_request`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bill`
--
ALTER TABLE `bill`
  ADD CONSTRAINT `FKhn2nihthxqqhxw3we3clpfhxp` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`id`);

--
-- Constraints for table `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `FKn7phgawjwo673xgim9d2cvfe1` FOREIGN KEY (`user_id`) REFERENCES `app_user` (`id`),
  ADD CONSTRAINT `FKq83pan5xy2a6rn0qsl9bckqai` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`);

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `FKewf90irce1ialx2d8ydumyeg7` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

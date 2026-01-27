-- Database Creation
CREATE DATABASE IF NOT EXISTS hotel_db;
USE hotel_db;

-- Table Structure: Room
DROP TABLE IF EXISTS room;
CREATE TABLE room (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(255),
    type VARCHAR(255),
    price_per_night DECIMAL(38,2),
    description VARCHAR(255),
    image_url VARCHAR(255),
    status VARCHAR(255) -- AVAILABLE, OCCUPIED, MAINTENANCE, DIRTY
);

-- Table Structure: Booking
DROP TABLE IF EXISTS booking;
CREATE TABLE booking (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    check_in_date DATE,
    check_out_date DATE,
    total_cost DECIMAL(38,2),
    is_checked_in BOOLEAN,
    is_checked_out BOOLEAN,
    FOREIGN KEY (room_id) REFERENCES room(id)
);

-- Table Structure: ServiceRequest
DROP TABLE IF EXISTS service_request;
CREATE TABLE service_request (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255),
    description VARCHAR(255),
    cost DECIMAL(38,2),
    status VARCHAR(255),
    room_number VARCHAR(255)
);

-- ----------------------------
-- DEMO DATA INSERTS
-- ----------------------------

-- Rooms (High quality Unsplash Images)
INSERT INTO room (room_number, type, price_per_night, description, image_url, status) VALUES 
('101', 'Deluxe Single', 120.00, 'A cozy retreat for the solo traveler with city views.', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1000&auto=format&fit=crop', 'AVAILABLE'),
('102', 'Standard Single', 100.00, 'Comfortable and affordable single room.', 'https://images.unsplash.com/photo-1595576517342-bc85d3914a29?q=80&w=1000&auto=format&fit=crop', 'AVAILABLE'),
('201', 'Double Comfort', 180.00, 'Perfect for couples, featuring a king-sized bed.', 'https://images.unsplash.com/photo-1590490360182-f33efe34ad7e?q=80&w=1000&auto=format&fit=crop', 'AVAILABLE'),
('202', 'Double Balcony', 200.00, 'Enjoy the fresh air with a private balcony.', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000&auto=format&fit=crop', 'DIRTY'),
('301', 'Junior Suite', 350.00, 'Spacious living area and premium amenities.', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop', 'AVAILABLE'),
('302', 'Presidential Suite', 800.00, 'The ultimate luxury experience with panoramic views.', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1000&auto=format&fit=crop', 'OCCUPIED');

-- Bookings
INSERT INTO booking (room_id, customer_name, customer_email, check_in_date, check_out_date, total_cost, is_checked_in, is_checked_out) VALUES
(6, 'John Wick', 'john@continental.com', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 DAY), 2400.00, TRUE, FALSE),
(4, 'Sarah Connor', 'sarah@skynet.net', DATE_SUB(CURDATE(), INTERVAL 2 DAY), CURDATE(), 400.00, TRUE, TRUE);

-- Service Requests
INSERT INTO service_request (type, description, cost, status, room_number) VALUES
('FOOD', 'Champagne and Strawberries', 150.00, 'PENDING', '302'),
('CLEANING', 'Extra towels requested', 0.00, 'COMPLETED', '201'),
('TRANSPORT', 'Airport Pickup for 2 Pax', 50.00, 'PENDING', '101');

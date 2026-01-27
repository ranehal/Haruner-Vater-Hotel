-- Users: Admin, Manager, Guest
INSERT INTO user (username, password, role, email) VALUES 
('admin', 'admin123', 'ADMIN', 'admin@hotel.com'),
('manager', 'manager123', 'MANAGER', 'manager@hotel.com'),
('guest', 'guest123', 'GUEST', 'guest@example.com'),
('john_doe', 'password', 'GUEST', 'john@example.com');

-- Rooms
INSERT INTO room (room_number, type, price_per_night, description, image_url, status) VALUES 
('101', 'Standard Single', 100.00, 'Cozy single room with city view', '/images/rooms/single.jpg', 'AVAILABLE'),
('102', 'Standard Double', 150.00, 'Spacious double room', '/images/rooms/twin.jpg', 'OCCUPIED'),
('201', 'Standard King', 200.00, 'King size bed with balcony', '/images/rooms/queen.jpg', 'AVAILABLE'),
('305', 'Deluxe Ocean View', 350.00, 'Panoramic ocean views and jacuzzi', '/images/rooms/ocean.jpg', 'AVAILABLE'),
('501', 'Presidential Suite', 1200.00, 'The ultimate luxury experience', '/images/rooms/luxury.jpg', 'MAINTENANCE'),
('404', 'Executive Suite', 500.00, 'Perfect for business travelers', '/images/rooms/executive.jpg', 'AVAILABLE');

-- Bookings (Past - Checked Out)
INSERT INTO booking (room_id, user_id, customer_name, customer_email, check_in_date, check_out_date, total_cost, is_checked_in, is_checked_out, customer_age, customer_phone) VALUES 
(1, 3, 'Guest User', 'guest@example.com', DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_SUB(CURDATE(), INTERVAL 5 DAY), 500.00, true, true, 30, '555-0101'),
(3, 4, 'John Doe', 'john@example.com', DATE_SUB(CURDATE(), INTERVAL 20 DAY), DATE_SUB(CURDATE(), INTERVAL 15 DAY), 1000.00, true, true, 35, '555-0102');

-- Bookings (Current - Checked In)
INSERT INTO booking (room_id, user_id, customer_name, customer_email, check_in_date, check_out_date, total_cost, is_checked_in, is_checked_out, customer_age, customer_phone) VALUES 
(2, 3, 'Guest User', 'guest@example.com', DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 3 DAY), 750.00, true, false, 30, '555-0101');

-- Bookings (Future)
INSERT INTO booking (room_id, user_id, customer_name, customer_email, check_in_date, check_out_date, total_cost, is_checked_in, is_checked_out, customer_age, customer_phone) VALUES 
(4, 4, 'John Doe', 'john@example.com', DATE_ADD(CURDATE(), INTERVAL 10 DAY), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 1750.00, false, false, 35, '555-0102');

-- Bills
-- Bill for Past Booking (Paid)
INSERT INTO bill (booking_id, amount, status, issue_date, due_date, payment_date, payment_method) VALUES 
(1, 500.00, 'PAID', DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_SUB(CURDATE(), INTERVAL 3 DAY), DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'CREDIT_CARD');

-- Bill for Current Booking (Unpaid)
INSERT INTO bill (booking_id, amount, status, issue_date, due_date) VALUES 
(3, 750.00, 'PENDING', DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 5 DAY));

-- Services
INSERT INTO service_request (room_number, type, description, status) VALUES 
('102', 'FOOD', 'Burger and Fries to room', 'PENDING'),
('201', 'CLEANING', 'Extra towels requested', 'COMPLETED');

-- Maintenance
INSERT INTO maintenance_ticket (room_number, issue_description, priority, status, report_date) VALUES 
('501', 'AC not cooling properly', 'HIGH', 'OPEN', DATE_SUB(CURDATE(), INTERVAL 1 DAY));

-- Reviews
INSERT INTO review (room_id, customer_name, rating, comment, review_date) VALUES 
(1, 'Guest User', 5, 'Absolutely loved the stay! The view was amazing.', DATE_SUB(CURDATE(), INTERVAL 4 DAY));

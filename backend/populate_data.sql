-- Disable foreign key checks to allow truncation
SET FOREIGN_KEY_CHECKS = 0;

-- Clear existing data
TRUNCATE TABLE booking;
TRUNCATE TABLE review;
TRUNCATE TABLE service_request;
TRUNCATE TABLE maintenance_ticket;
TRUNCATE TABLE coupon;
TRUNCATE TABLE room;
TRUNCATE TABLE app_user;

-- Enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------
-- 1. USERS (app_user)
-- --------------------------------------------------------
INSERT INTO app_user (username, password, role, email) VALUES 
('admin', 'password', 'ADMIN', 'admin@hotel.com'),
('manager', 'password', 'MANAGER', 'manager@hotel.com'),
('guest', 'password', 'GUEST', 'guest@hotel.com'),
('john_doe', 'password', 'GUEST', 'john.doe@example.com'),
('jane_smith', 'password', 'GUEST', 'jane.smith@example.com'),
('mike_ross', 'password', 'GUEST', 'mike.ross@pearman.com'),
('rachel_zane', 'password', 'GUEST', 'rachel.zane@pearman.com'),
('harvey_specter', 'password', 'GUEST', 'harvey.specter@pearman.com'),
('louis_litt', 'password', 'GUEST', 'louis.litt@pearman.com'),
('donna_paulsen', 'password', 'GUEST', 'donna.paulsen@pearman.com'),
('jessica_pearson', 'password', 'GUEST', 'jessica.pearson@pearman.com'),
('alex_williams', 'password', 'GUEST', 'alex.williams@pearman.com'),
('katrina_bennett', 'password', 'GUEST', 'katrina.bennett@pearman.com'),
('robert_zane', 'password', 'GUEST', 'robert.zane@randk.com'),
('samantha_wheeler', 'password', 'GUEST', 'samantha.wheeler@pearman.com'),
('daniel_hardman', 'password', 'GUEST', 'daniel.hardman@hardman.com'),
('sheila_szs', 'password', 'GUEST', 'sheila.szs@harvard.edu'),
('scottie', 'password', 'GUEST', 'dana.scott@scotts.com');

-- --------------------------------------------------------
-- 2. COUPONS
-- --------------------------------------------------------
INSERT INTO coupon (code, discount_percentage, expiry_date, is_active) VALUES 
('WELCOME10', 10, DATE_ADD(CURDATE(), INTERVAL 1 YEAR), 1),
('SUMMER20', 20, DATE_ADD(CURDATE(), INTERVAL 3 MONTH), 1),
('WINTER15', 15, DATE_ADD(CURDATE(), INTERVAL 3 MONTH), 1),
('VIP50', 50, DATE_ADD(CURDATE(), INTERVAL 2 YEAR), 1),
('FLASHDEAL', 30, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 1),
('EXPIRED05', 5, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 0);

-- --------------------------------------------------------
-- 3. ROOMS (20+ Rooms, Varied Types & Statuses)
-- --------------------------------------------------------
-- Floor 1: Standard & Accessible
INSERT INTO room (room_number, type, price_per_night, description, image_url, status, deleted) VALUES
('101', 'Cozy Single', 85.00, 'Compact room for solo travelers with a comfortable single bed and work desk.', '/images/rooms/single.jpg', 'AVAILABLE', 0),
('102', 'Standard Queen', 110.00, 'A welcoming room featuring a queen-sized bed and modern amenities.', '/images/rooms/queen.jpg', 'OCCUPIED', 0),
('103', 'Accessible Queen', 110.00, 'Thoughtfully designed with wider doorways and roll-in shower.', '/images/rooms/accessible.jpg', 'AVAILABLE', 0),
('104', 'Standard Twin', 120.00, 'Two twin beds, perfect for friends or colleagues sharing a room.', '/images/rooms/twin.jpg', 'DIRTY', 0),
('105', 'Standard Double', 125.00, 'Comfortable double bed with courtyard views.', '/images/rooms/queen.jpg', 'AVAILABLE', 0),
('106', 'Budget Single', 75.00, 'Our most affordable option for the budget-conscious traveler.', '/images/rooms/single.jpg', 'AVAILABLE', 0),

-- Floor 2: Deluxe & View
('201', 'Deluxe King', 160.00, 'Spacious room with a king bed and seating area.', '/images/rooms/deluxe.jpg', 'AVAILABLE', 0),
('202', 'Garden View Deluxe', 175.00, 'Peaceful retreat overlooking the lush hotel gardens.', '/images/rooms/garden.jpg', 'OCCUPIED', 0),
('203', 'Ocean View King', 220.00, 'Stunning panoramic views of the ocean from your bed.', '/images/rooms/ocean.jpg', 'AVAILABLE', 0),
('204', 'Deluxe Twin', 170.00, 'Premium twin room with upgraded amenities and city views.', '/images/rooms/twin.jpg', 'MAINTENANCE', 0),
('205', 'Executive Double', 190.00, 'Ideal for business travelers, includes lounge access.', '/images/rooms/executive.jpg', 'OCCUPIED', 0),
('206', 'Terrace King', 210.00, 'Features a private outdoor terrace for relaxation.', '/images/rooms/garden.jpg', 'AVAILABLE', 0),

-- Floor 3: Suites
('301', 'Junior Suite', 300.00, 'Open-plan suite with a dedicated living area and soaking tub.', '/images/rooms/suite_junior.jpg', 'AVAILABLE', 0),
('302', 'Family Suite', 380.00, 'Two connecting bedrooms and a kitchenette for family convenience.', '/images/rooms/twin.jpg', 'DIRTY', 0),
('303', 'Honeymoon Suite', 450.00, 'Romantic getaway with a jacuzzi, four-poster bed, and champagne service.', '/images/rooms/suite_honey.jpg', 'OCCUPIED', 0),
('304', 'Business Suite', 350.00, 'Includes a private meeting space and high-speed fiber internet.', '/images/rooms/executive.jpg', 'AVAILABLE', 0),
('305', 'Corner Suite', 320.00, 'Dual-aspect windows offering plenty of natural light and views.', '/images/rooms/suite_junior.jpg', 'AVAILABLE', 0),

-- Floor 4: Luxury & Penthouse
('401', 'Presidential Suite', 1200.00, 'The pinnacle of luxury with a private dining room and butler service.', '/images/rooms/luxury.jpg', 'BOOKED', 0),
('402', 'Royal Penthouse', 1500.00, 'Top-floor exclusivity with a private rooftop terrace and infinity pool.', '/images/rooms/luxury.jpg', 'MAINTENANCE', 0),
('403', 'Ambassador Suite', 900.00, 'Grand suite designed for dignitaries and VIPs.', '/images/rooms/luxury.jpg', 'AVAILABLE', 0);

-- --------------------------------------------------------
-- 4. BOOKINGS
-- --------------------------------------------------------
-- Past Bookings (Completed)
INSERT INTO booking (room_id, user_id, customer_name, customer_email, check_in_date, check_out_date, total_cost, is_checked_in, is_checked_out, coupon_code) VALUES
((SELECT id FROM room WHERE room_number='101'), (SELECT id FROM app_user WHERE username='john_doe'), 'John Doe', 'john.doe@example.com', DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_SUB(CURDATE(), INTERVAL 7 DAY), 255.00, 1, 1, NULL),
((SELECT id FROM room WHERE room_number='203'), (SELECT id FROM app_user WHERE username='mike_ross'), 'Mike Ross', 'mike.ross@pearman.com', DATE_SUB(CURDATE(), INTERVAL 5 DAY), DATE_SUB(CURDATE(), INTERVAL 2 DAY), 660.00, 1, 1, 'WELCOME10'),
((SELECT id FROM room WHERE room_number='303'), (SELECT id FROM app_user WHERE username='harvey_specter'), 'Harvey Specter', 'harvey.specter@pearman.com', DATE_SUB(CURDATE(), INTERVAL 15 DAY), DATE_SUB(CURDATE(), INTERVAL 12 DAY), 1350.00, 1, 1, 'VIP50'),
((SELECT id FROM room WHERE room_number='102'), (SELECT id FROM app_user WHERE username='rachel_zane'), 'Rachel Zane', 'rachel.zane@pearman.com', DATE_SUB(CURDATE(), INTERVAL 20 DAY), DATE_SUB(CURDATE(), INTERVAL 18 DAY), 220.00, 1, 1, NULL),
((SELECT id FROM room WHERE room_number='201'), (SELECT id FROM app_user WHERE username='louis_litt'), 'Louis Litt', 'louis.litt@pearman.com', DATE_SUB(CURDATE(), INTERVAL 30 DAY), DATE_SUB(CURDATE(), INTERVAL 25 DAY), 800.00, 1, 1, NULL);

-- Current Bookings (Occupied)
INSERT INTO booking (room_id, user_id, customer_name, customer_email, check_in_date, check_out_date, total_cost, is_checked_in, is_checked_out, coupon_code) VALUES
((SELECT id FROM room WHERE room_number='102'), (SELECT id FROM app_user WHERE username='jane_smith'), 'Jane Smith', 'jane.smith@example.com', DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 2 DAY), 330.00, 1, 0, NULL),
((SELECT id FROM room WHERE room_number='202'), (SELECT id FROM app_user WHERE username='donna_paulsen'), 'Donna Paulsen', 'donna.paulsen@pearman.com', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 DAY), 525.00, 1, 0, 'SUMMER20'),
((SELECT id FROM room WHERE room_number='205'), (SELECT id FROM app_user WHERE username='alex_williams'), 'Alex Williams', 'alex.williams@pearman.com', DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 570.00, 1, 0, NULL),
((SELECT id FROM room WHERE room_number='303'), (SELECT id FROM app_user WHERE username='jessica_pearson'), 'Jessica Pearson', 'jessica.pearson@pearman.com', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY), 2250.00, 1, 0, 'VIP50');

-- Future Bookings
INSERT INTO booking (room_id, user_id, customer_name, customer_email, check_in_date, check_out_date, total_cost, is_checked_in, is_checked_out, coupon_code) VALUES
((SELECT id FROM room WHERE room_number='401'), (SELECT id FROM app_user WHERE username='robert_zane'), 'Robert Zane', 'robert.zane@randk.com', DATE_ADD(CURDATE(), INTERVAL 5 DAY), DATE_ADD(CURDATE(), INTERVAL 7 DAY), 2400.00, 0, 0, NULL),
((SELECT id FROM room WHERE room_number='105'), (SELECT id FROM app_user WHERE username='katrina_bennett'), 'Katrina Bennett', 'katrina.bennett@pearman.com', DATE_ADD(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 4 DAY), 250.00, 0, 0, NULL);

-- --------------------------------------------------------
-- 5. REVIEWS
-- --------------------------------------------------------
INSERT INTO review (room_id, customer_name, rating, comment) VALUES
((SELECT id FROM room WHERE room_number='101'), 'John Doe', 5, 'Perfect for my short business trip. Very clean.'),
((SELECT id FROM room WHERE room_number='203'), 'Mike Ross', 4, 'The view was incredible, but the WiFi was a bit spotty.'),
((SELECT id FROM room WHERE room_number='303'), 'Harvey Specter', 5, 'Exceptional service. The best in the city.'),
((SELECT id FROM room WHERE room_number='102'), 'Rachel Zane', 3, 'Room was okay, but a bit noisy from the street.'),
((SELECT id FROM room WHERE room_number='201'), 'Louis Litt', 2, 'My mud bath was cold. Unacceptable!');

-- --------------------------------------------------------
-- 6. SERVICE REQUESTS
-- --------------------------------------------------------
INSERT INTO service_request (type, description, cost, status, room_number) VALUES
('FOOD', 'Club Sandwich and Fries', 25.00, 'PENDING', '102'),
('CLEANING', 'Extra pillows and towels', 0.00, 'COMPLETED', '202'),
('TRANSPORT', 'Limousine to Airport 6 AM', 150.00, 'PENDING', '303'),
('FOOD', 'Champagne bucket and strawberries', 80.00, 'COMPLETED', '205'),
('TRIP', 'City Sightseeing Tour', 100.00, 'CANCELLED', '105'),
('CLEANING', 'Spill on carpet', 0.00, 'PENDING', '102');

-- --------------------------------------------------------
-- 7. MAINTENANCE TICKETS
-- --------------------------------------------------------
INSERT INTO maintenance_ticket (room_number, issue_description, priority, status, reported_at) VALUES
('204', 'Air conditioning unit leaking water.', 'HIGH', 'IN_PROGRESS', NOW()),
('104', 'TV remote not working.', 'LOW', 'OPEN', NOW()),
('402', 'Pool filter making loud noise.', 'MEDIUM', 'OPEN', NOW()),
('302', 'Balcony door stuck.', 'MEDIUM', 'RESOLVED', DATE_SUB(NOW(), INTERVAL 2 DAY));


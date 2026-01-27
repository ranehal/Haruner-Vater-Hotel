package com.hotel.service;

import com.hotel.model.*;
import com.hotel.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final MaintenanceTicketRepository maintenanceRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;
    private final ServiceRequestRepository serviceRequestRepository;
    private final CouponRepository couponRepository;
    private final JdbcTemplate jdbcTemplate;

    public DataSeeder(RoomRepository roomRepository, 
                      UserRepository userRepository, 
                      MaintenanceTicketRepository maintenanceRepository,
                      BookingRepository bookingRepository,
                      ReviewRepository reviewRepository,
                      ServiceRequestRepository serviceRequestRepository,
                      CouponRepository couponRepository,
                      JdbcTemplate jdbcTemplate) {
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.maintenanceRepository = maintenanceRepository;
        this.bookingRepository = bookingRepository;
        this.reviewRepository = reviewRepository;
        this.serviceRequestRepository = serviceRequestRepository;
        this.couponRepository = couponRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Refreshing Database with busy hotel data...");
        truncateTables();
        seedCoupons();
        seedUsers();
        seedRooms();
        seedBookingsAndReviews();
        seedMaintenance();
        seedServiceRequests();
        System.out.println("Database refreshed successfully!");
    }

    private void truncateTables() {
        jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 0");
        jdbcTemplate.execute("TRUNCATE TABLE booking");
        jdbcTemplate.execute("TRUNCATE TABLE review");
        jdbcTemplate.execute("TRUNCATE TABLE service_request");
        jdbcTemplate.execute("TRUNCATE TABLE maintenance_ticket");
        jdbcTemplate.execute("TRUNCATE TABLE coupon");
        jdbcTemplate.execute("TRUNCATE TABLE room");
        jdbcTemplate.execute("TRUNCATE TABLE app_user");
        jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 1");
    }

    private void seedCoupons() {
        List<Coupon> coupons = Arrays.asList(
            new Coupon("WELCOME10", 10, LocalDate.now().plusMonths(6), true),
            new Coupon("SUMMER20", 20, LocalDate.now().plusMonths(3), true),
            new Coupon("VIP50", 50, LocalDate.now().plusYears(1), true),
            new Coupon("FLASHDEAL", 30, LocalDate.now().plusDays(2), true),
            new Coupon("EXPIRED5", 5, LocalDate.now().minusDays(1), false)
        );
        couponRepository.saveAll(coupons);
    }

    private void seedUsers() {
        List<User> users = Arrays.asList(
            new User("admin", "password", "ADMIN", "admin@hotel.com"),
            new User("manager", "password", "MANAGER", "manager@hotel.com"),
            new User("guest", "password", "GUEST", "guest@hotel.com"),
            new User("john_doe", "password", "GUEST", "john.d@example.com"),
            new User("jane_smith", "password", "GUEST", "jane.s@example.com"),
            new User("mike_ross", "password", "GUEST", "mike.r@pearman.com"),
            new User("rachel_zane", "password", "GUEST", "rachel.z@pearman.com"),
            new User("harvey_specter", "password", "GUEST", "harvey@specter.com"),
            new User("louis_litt", "password", "GUEST", "louis@litt.com"),
            new User("donna_paulsen", "password", "GUEST", "donna@expert.com"),
            new User("jessica_pearson", "password", "GUEST", "jessica@pearman.com"),
            new User("alex_williams", "password", "GUEST", "alex.w@pearman.com"),
            new User("katrina_bennett", "password", "GUEST", "katrina.b@pearman.com"),
            new User("robert_zane", "password", "GUEST", "robert.z@randk.com"),
            new User("samantha_wheeler", "password", "GUEST", "samantha.w@pearman.com")
        );
        userRepository.saveAll(users);
    }

    private void seedRooms() {
        List<Room> rooms = Arrays.asList(
            // Floor 1
            new Room("101", "Cozy Single", new BigDecimal("85.00"), "Perfect for solo travelers.", "/images/rooms/single.jpg", "AVAILABLE"),
            new Room("102", "Standard Queen", new BigDecimal("120.00"), "Comfortable queen bed.", "/images/rooms/queen.jpg", "AVAILABLE"),
            new Room("103", "Standard Twin", new BigDecimal("130.00"), "Two twin beds, city views.", "/images/rooms/twin.jpg", "AVAILABLE"),
            new Room("104", "Accessible Queen", new BigDecimal("120.00"), "ADA compliant room.", "/images/rooms/accessible.jpg", "AVAILABLE"),
            new Room("105", "Standard King", new BigDecimal("140.00"), "Spacious king bed.", "/images/rooms/deluxe.jpg", "AVAILABLE"),
            new Room("106", "Budget Single", new BigDecimal("70.00"), "Minimalist and affordable.", "/images/rooms/single.jpg", "AVAILABLE"),
            
            // Floor 2
            new Room("201", "Deluxe King", new BigDecimal("180.00"), "King bed, seating area.", "/images/rooms/deluxe.jpg", "AVAILABLE"),
            new Room("202", "Garden View Deluxe", new BigDecimal("190.00"), "Overlooking gardens.", "/images/rooms/garden.jpg", "AVAILABLE"),
            new Room("203", "Ocean View King", new BigDecimal("220.00"), "Stunning ocean views.", "/images/rooms/ocean.jpg", "AVAILABLE"),
            new Room("204", "Executive Corner", new BigDecimal("240.00"), "Panoramic windows.", "/images/rooms/executive.jpg", "AVAILABLE"),
            new Room("205", "Deluxe Twin", new BigDecimal("190.00"), "Premium two-bed room.", "/images/rooms/twin.jpg", "AVAILABLE"),
            new Room("206", "Terrace King", new BigDecimal("210.00"), "Private outdoor terrace.", "/images/rooms/garden.jpg", "AVAILABLE"),

            // Floor 3
            new Room("301", "Junior Suite", new BigDecimal("350.00"), "Open-plan suite.", "/images/rooms/suite_junior.jpg", "AVAILABLE"),
            new Room("302", "Family Suite", new BigDecimal("400.00"), "Two bedrooms, kitchenette.", "/images/rooms/twin.jpg", "AVAILABLE"),
            new Room("303", "Honeymoon Suite", new BigDecimal("450.00"), "Jacuzzi, four-poster bed.", "/images/rooms/suite_honey.jpg", "AVAILABLE"),
            new Room("304", "Business Suite", new BigDecimal("380.00"), "Meeting area.", "/images/rooms/executive.jpg", "AVAILABLE"),
            new Room("305", "Corner Suite", new BigDecimal("320.00"), "Dual-aspect views.", "/images/rooms/suite_junior.jpg", "AVAILABLE"),

            // Floor 4
            new Room("401", "Presidential Suite", new BigDecimal("1200.00"), "Private dining, butler.", "/images/rooms/luxury.jpg", "AVAILABLE"),
            new Room("402", "Royal Penthouse", new BigDecimal("1500.00"), "Infinity pool.", "/images/rooms/luxury.jpg", "AVAILABLE"),
            new Room("403", "Ambassador Suite", new BigDecimal("900.00"), "VIP luxury experience.", "/images/rooms/luxury.jpg", "AVAILABLE")
        );
        roomRepository.saveAll(rooms);
    }

    private void seedBookingsAndReviews() {
        List<User> users = userRepository.findAll();
        List<Room> rooms = roomRepository.findAll();
        if (users.size() < 10 || rooms.size() < 10) return;

        // Past Bookings
        createPastBooking(users.get(3), rooms.get(0), 10, "Great stay!", 5);
        createPastBooking(users.get(5), rooms.get(8), 5, "Unbelievable view.", 5);
        createPastBooking(users.get(8), rooms.get(2), 3, "Decent but simple.", 3);
        createPastBooking(users.get(7), rooms.get(17), 2, "World class service.", 5);
        createPastBooking(users.get(9), rooms.get(6), 4, "Loved the amenities.", 4);

        // Current Bookings (Update Room Status)
        createCurrentBooking(users.get(4), rooms.get(1));
        createCurrentBooking(users.get(6), rooms.get(10));
        createCurrentBooking(users.get(10), rooms.get(14));
        createCurrentBooking(users.get(11), rooms.get(18));
    }

    private void createPastBooking(User user, Room room, int daysAgo, String reviewComment, int rating) {
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRoom(room);
        booking.setCustomerName(user.getUsername());
        booking.setCustomerEmail(user.getEmail());
        booking.setCheckInDate(LocalDate.now().minusDays(daysAgo + 5));
        booking.setCheckOutDate(LocalDate.now().minusDays(5));
        booking.setTotalCost(room.getPricePerNight().multiply(new BigDecimal(daysAgo)));
        booking.setCheckedIn(true);
        booking.setCheckedOut(true);
        bookingRepository.save(booking);

        if (reviewComment != null) {
            Review review = new Review(room, user.getUsername(), rating, reviewComment);
            reviewRepository.save(review);
        }
    }

    private void createCurrentBooking(User user, Room room) {
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRoom(room);
        booking.setCustomerName(user.getUsername());
        booking.setCustomerEmail(user.getEmail());
        booking.setCheckInDate(LocalDate.now().minusDays(1));
        booking.setCheckOutDate(LocalDate.now().plusDays(2));
        booking.setTotalCost(room.getPricePerNight().multiply(new BigDecimal(3)));
        booking.setCheckedIn(true);
        booking.setCheckedOut(false);
        bookingRepository.save(booking);
        
        room.setStatus("OCCUPIED");
        roomRepository.save(room);
    }

    private void seedMaintenance() {
        List<MaintenanceTicket> tickets = Arrays.asList(
            new MaintenanceTicket("204", "AC leaking", "HIGH"),
            new MaintenanceTicket("104", "Remote missing", "LOW"),
            new MaintenanceTicket("402", "Pool filter check", "MEDIUM")
        );
        maintenanceRepository.saveAll(tickets);
    }

    private void seedServiceRequests() {
        List<ServiceRequest> requests = Arrays.asList(
            new ServiceRequest("FOOD", "Burger and Coke", new BigDecimal("20.00"), "PENDING", "102"),
            new ServiceRequest("CLEANING", "Extra towels", new BigDecimal("0.00"), "COMPLETED", "204"),
            new ServiceRequest("TRANSPORT", "Taxi to Airport", new BigDecimal("50.00"), "PENDING", "303")
        );
        serviceRequestRepository.saveAll(requests);
    }
}

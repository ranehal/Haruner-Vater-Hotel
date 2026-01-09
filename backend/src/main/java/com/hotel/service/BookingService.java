package com.hotel.service;

import com.hotel.model.Booking;
import com.hotel.model.Room;
import com.hotel.model.User;
import com.hotel.model.Coupon;
import com.hotel.repository.BookingRepository;
import com.hotel.repository.CouponRepository;
import com.hotel.repository.RoomRepository;
import com.hotel.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final CouponRepository couponRepository;

    public BookingService(BookingRepository bookingRepository, RoomRepository roomRepository, UserRepository userRepository, CouponRepository couponRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.couponRepository = couponRepository;
    }

    public Booking createBooking(Booking booking, Long userId) {
        // 1. Fetch Room and User
        Room room = roomRepository.findById(booking.getRoom().getId())
                .orElseThrow(() -> new RuntimeException("Room not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        booking.setRoom(room);
        booking.setUser(user);
        booking.setCustomerName(user.getUsername());
        booking.setCustomerEmail(user.getEmail());

        // 2. Double Booking Guard
        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                room.getId(), booking.getCheckInDate(), booking.getCheckOutDate());
        if (!overlapping.isEmpty()) {
            throw new RuntimeException("Room is already booked for these dates.");
        }

        // 3. Smart Pricing (Weekend Surge + Daily Calculation)
        BigDecimal totalPrice = BigDecimal.ZERO;
        LocalDate current = booking.getCheckInDate();
        
        while (current.isBefore(booking.getCheckOutDate())) {
            BigDecimal dailyRate = room.getPricePerNight();
            DayOfWeek day = current.getDayOfWeek();
            
            // Friday & Saturday = +25%
            if (day == DayOfWeek.FRIDAY || day == DayOfWeek.SATURDAY) {
                dailyRate = dailyRate.multiply(new BigDecimal("1.25"));
            }
            
            totalPrice = totalPrice.add(dailyRate);
            current = current.plusDays(1);
        }

        // 4. Loyalty Check (> 3 bookings)
        long pastBookings = bookingRepository.countByUserId(userId);
        if (pastBookings > 3) {
            // Apply 10% discount
            totalPrice = totalPrice.multiply(new BigDecimal("0.90"));
        }

        // 5. Coupon Application
        if (booking.getCouponCode() != null && !booking.getCouponCode().isEmpty()) {
            Optional<Coupon> couponOpt = couponRepository.findByCode(booking.getCouponCode().toUpperCase());
            if (couponOpt.isPresent()) {
                Coupon coupon = couponOpt.get();
                if (coupon.isActive() && (coupon.getExpiryDate() == null || coupon.getExpiryDate().isAfter(LocalDate.now()))) {
                     // Apply discount
                     BigDecimal discountFactor = BigDecimal.ONE.subtract(new BigDecimal(coupon.getDiscountPercentage()).divide(new BigDecimal(100)));
                     totalPrice = totalPrice.multiply(discountFactor);
                }
            }
        }

        booking.setTotalCost(totalPrice);
        
        return bookingRepository.save(booking);
    }
}

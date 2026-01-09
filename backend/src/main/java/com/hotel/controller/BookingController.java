package com.hotel.controller;

import com.hotel.model.Booking;
import com.hotel.model.Room;
import com.hotel.repository.BookingRepository;
import com.hotel.repository.RoomRepository;
import com.hotel.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final BookingService bookingService;

    public BookingController(BookingRepository bookingRepository, RoomRepository roomRepository, BookingService bookingService) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking, @RequestParam Long userId) {
        try {
            Booking savedBooking = bookingService.createBooking(booking, userId);
            return ResponseEntity.ok(savedBooking);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping
    public List<Booking> getAllBookings(@RequestParam(required = false) Long userId, @RequestParam(required = false) Long roomId) {
        if (userId != null) {
            return bookingRepository.findByUserId(userId);
        }
        if (roomId != null) {
            return bookingRepository.findByRoomId(roomId);
        }
        return bookingRepository.findAll();
    }

    @PutMapping("/{id}")
    public Booking updateBookingStatus(@PathVariable Long id, @RequestBody Booking updates) {
        Booking booking = bookingRepository.findById(id).orElseThrow();
        booking.setCheckedIn(updates.isCheckedIn());
        booking.setCheckedOut(updates.isCheckedOut());
        
        // If checking in, mark room occupied
        if (updates.isCheckedIn() && !updates.isCheckedOut()) {
            Room r = booking.getRoom();
            r.setStatus("OCCUPIED");
            roomRepository.save(r);
        }
        // If checking out, mark room dirty
        if (updates.isCheckedOut()) {
            Room r = booking.getRoom();
            r.setStatus("DIRTY");
            roomRepository.save(r);
        }
        
        return bookingRepository.save(booking);
    }
}

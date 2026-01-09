package com.hotel.repository;

import com.hotel.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    // Find overlapping bookings for a room
    // Logic: (StartA < EndB) and (EndA > StartB)
    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId AND b.checkInDate < :checkOutDate AND b.checkOutDate > :checkInDate")
    List<Booking> findOverlappingBookings(@Param("roomId") Long roomId, @Param("checkInDate") LocalDate checkInDate, @Param("checkOutDate") LocalDate checkOutDate);

    long countByUserId(Long userId);
    
    List<Booking> findByUserId(Long userId);

    List<Booking> findByRoomId(Long roomId);
}
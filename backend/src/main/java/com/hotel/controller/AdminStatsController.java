package com.hotel.controller;

import com.hotel.model.Room;
import com.hotel.repository.BookingRepository;
import com.hotel.repository.RoomRepository;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminStatsController {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;

    public AdminStatsController(BookingRepository bookingRepository, RoomRepository roomRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
    }

    @GetMapping
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // 1. Total Revenue
        BigDecimal totalRevenue = bookingRepository.findAll().stream()
                .map(b -> b.getTotalCost() != null ? b.getTotalCost() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalRevenue", totalRevenue);

        // 2. Occupancy Rate
        List<Room> allRooms = roomRepository.findAll();
        long occupiedCount = allRooms.stream().filter(r -> "OCCUPIED".equals(r.getStatus())).count();
        double occupancyRate = allRooms.isEmpty() ? 0 : ((double) occupiedCount / allRooms.size()) * 100;
        stats.put("occupancyRate", occupancyRate);
        stats.put("totalRooms", allRooms.size());

        // 3. RevPAR (Revenue Per Available Room)
        // Formula: Total Room Revenue / Total Rooms Available (using Total Rooms for simplified RevPAR)
        // Note: Real RevPAR is usually calculated over a period (e.g., daily). 
        // Here we'll do a simplified snapshot: (Total Revenue / Total Rooms) just to show the metric exists.
        double revPAR = allRooms.isEmpty() ? 0 : totalRevenue.doubleValue() / allRooms.size();
        stats.put("revPAR", revPAR);

        return stats;
    }
}

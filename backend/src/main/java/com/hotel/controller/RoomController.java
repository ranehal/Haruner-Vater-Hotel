package com.hotel.controller;

import com.hotel.model.Review;
import com.hotel.model.Room;
import com.hotel.repository.ReviewRepository;
import com.hotel.repository.RoomRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:5173") // Vite default port
public class RoomController {

    private final RoomRepository roomRepository;
    private final ReviewRepository reviewRepository;

    public RoomController(RoomRepository roomRepository, ReviewRepository reviewRepository) {
        this.roomRepository = roomRepository;
        this.reviewRepository = reviewRepository;
    }

    @GetMapping
    public List<Room> getAllRooms() {
        List<Room> rooms = roomRepository.findByDeletedFalse();
        rooms.forEach(this::calculateRating);
        return rooms;
    }
    
    @GetMapping("/{id}")
    public Room getRoom(@PathVariable Long id) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new RuntimeException("Room not found"));
        calculateRating(room);
        return room;
    }

    private void calculateRating(Room room) {
        List<Review> reviews = reviewRepository.findByRoomId(room.getId());
        if (!reviews.isEmpty()) {
            double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
            room.setAverageRating(Math.round(avg * 10.0) / 10.0);
            room.setTotalReviews(reviews.size());
        } else {
            room.setAverageRating(0.0);
            room.setTotalReviews(0);
        }
    }

    @PostMapping
    public Room createRoom(@RequestBody Room room) {
        return roomRepository.save(room);
    }

    @PutMapping("/{id}")
    public Room updateRoom(@PathVariable Long id, @RequestBody Room roomDetails) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new RuntimeException("Room not found"));
        room.setRoomNumber(roomDetails.getRoomNumber());
        room.setType(roomDetails.getType());
        room.setPricePerNight(roomDetails.getPricePerNight());
        room.setDescription(roomDetails.getDescription());
        room.setImageUrl(roomDetails.getImageUrl());
        room.setStatus(roomDetails.getStatus());
        return roomRepository.save(room);
    }

    @DeleteMapping("/{id}")
    public void deleteRoom(@PathVariable Long id) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new RuntimeException("Room not found"));
        room.setDeleted(true);
        roomRepository.save(room);
    }
}

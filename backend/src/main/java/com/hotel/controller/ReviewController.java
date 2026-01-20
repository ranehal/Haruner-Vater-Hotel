package com.hotel.controller;

import com.hotel.model.Review;
import com.hotel.model.Room;
import com.hotel.repository.ReviewRepository;
import com.hotel.repository.RoomRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final RoomRepository roomRepository;

    public ReviewController(ReviewRepository reviewRepository, RoomRepository roomRepository) {
        this.reviewRepository = reviewRepository;
        this.roomRepository = roomRepository;
    }

    @PostMapping
    public Review createReview(@RequestBody Review review) {
        // Ensure room exists
        if (review.getRoom() != null && review.getRoom().getId() != null) {
            Room r = roomRepository.findById(review.getRoom().getId()).orElseThrow();
            review.setRoom(r);
        }
        return reviewRepository.save(review);
    }
    
    @GetMapping
    public List<Review> getAllReviews(@RequestParam(required = false) Long roomId) {
        if (roomId != null) {
            return reviewRepository.findByRoomId(roomId);
        }
        return reviewRepository.findAll();
    }

    @GetMapping("/{id}")
    public Review getReviewById(@PathVariable("id") Long id) {
        return reviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Review not found"));
    }

    @PutMapping("/{id}")
    public Review updateReview(@PathVariable("id") Long id, @RequestBody Review reviewDetails) {
        Review review = reviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Review not found"));
        review.setRating(reviewDetails.getRating());
        review.setComment(reviewDetails.getComment());
        return reviewRepository.save(review);
    }
}

package com.foodexpress.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodexpress.backend.model.Review;
import com.foodexpress.backend.repository.ReviewRepository;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177"
})
public class ReviewController {

    private final ReviewRepository reviewRepository;

    public ReviewController(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    // Add Review
    @PostMapping
    public Review addReview(@RequestBody Review review) {
        return reviewRepository.save(review);
    }

    // Get All Reviews
    @GetMapping
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    // Get Reviews By Restaurant
    @GetMapping("/restaurant/{restaurantId}")
    public List<Review> getRestaurantReviews(
            @PathVariable String restaurantId) {

        return reviewRepository.findByRestaurantId(restaurantId);
    }

    // Get Reviews By Customer
    @GetMapping("/customer/{customerId}")
    public List<Review> getCustomerReviews(
            @PathVariable String customerId) {

        return reviewRepository.findByCustomerId(customerId);
    }

    // Delete Review
    @DeleteMapping("/{id}")
    public String deleteReview(@PathVariable String id) {

        reviewRepository.deleteById(id);

        return "Review deleted successfully";
    }
}
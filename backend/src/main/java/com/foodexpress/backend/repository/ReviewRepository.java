package com.foodexpress.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.foodexpress.backend.model.Review;

public interface ReviewRepository
        extends MongoRepository<Review, String> {

    List<Review> findByRestaurantId(String restaurantId);

    List<Review> findByCustomerId(String customerId);
}
package com.foodexpress.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.foodexpress.backend.model.Restaurant;

public interface RestaurantRepository
        extends MongoRepository<Restaurant, String> {
} 
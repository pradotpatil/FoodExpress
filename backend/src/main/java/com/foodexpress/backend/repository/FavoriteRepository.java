package com.foodexpress.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.foodexpress.backend.model.Favorite;

public interface FavoriteRepository
        extends MongoRepository<Favorite, String> {

    List<Favorite> findByCustomerId(String customerId);

    Optional<Favorite> findByCustomerIdAndRestaurantId(
            String customerId,
            String restaurantId
    );

    void deleteByCustomerIdAndRestaurantId(
            String customerId,
            String restaurantId
    );
}
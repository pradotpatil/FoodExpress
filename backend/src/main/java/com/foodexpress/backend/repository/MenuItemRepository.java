package com.foodexpress.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.foodexpress.backend.model.MenuItem;

public interface MenuItemRepository extends MongoRepository<MenuItem, String> {

    List<MenuItem> findByRestaurantId(String restaurantId);

}
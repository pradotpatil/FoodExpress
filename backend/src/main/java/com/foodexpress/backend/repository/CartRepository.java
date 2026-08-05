package com.foodexpress.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.foodexpress.backend.model.Cart;

public interface CartRepository
        extends MongoRepository<Cart, String> {

    List<Cart> findByCustomerId(String customerId);
}
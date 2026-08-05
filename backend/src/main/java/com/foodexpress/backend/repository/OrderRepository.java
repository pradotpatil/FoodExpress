package com.foodexpress.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.foodexpress.backend.model.Order;

public interface OrderRepository
        extends MongoRepository<Order, String> {

    List<Order> findByCustomerId(String customerId);

    List<Order> findByCustomerIdOrderByIdDesc(
            String customerId
    );
}
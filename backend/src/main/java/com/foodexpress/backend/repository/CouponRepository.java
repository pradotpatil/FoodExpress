package com.foodexpress.backend.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.foodexpress.backend.model.Coupon;

public interface CouponRepository
        extends MongoRepository<Coupon, String> {

    Optional<Coupon> findByCodeIgnoreCase(String code);

    boolean existsByCodeIgnoreCase(String code);
}
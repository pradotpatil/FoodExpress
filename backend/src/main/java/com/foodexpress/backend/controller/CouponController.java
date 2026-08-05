package com.foodexpress.backend.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.foodexpress.backend.model.Coupon;
import com.foodexpress.backend.repository.CouponRepository;

@RestController
@RequestMapping("/api/coupons")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177"
})
public class CouponController {

    private final CouponRepository couponRepository;

    public CouponController(
            CouponRepository couponRepository) {

        this.couponRepository = couponRepository;
    }

    // Add coupon
    @PostMapping
    public ResponseEntity<?> addCoupon(
            @RequestBody Coupon coupon) {

        if (
            coupon.getCode() == null ||
            coupon.getCode().trim().isEmpty()
        ) {
            return ResponseEntity
                    .badRequest()
                    .body("Coupon code is required.");
        }

        String cleanCode = coupon.getCode()
                .trim()
                .toUpperCase();

        if (
            couponRepository
                    .existsByCodeIgnoreCase(cleanCode)
        ) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Coupon code already exists.");
        }

        coupon.setCode(cleanCode);

        Coupon savedCoupon =
                couponRepository.save(coupon);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedCoupon);
    }

    // Get all coupons
    @GetMapping
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    // Get coupon by ID
    @GetMapping("/{id}")
    public Coupon getCouponById(
            @PathVariable String id) {

        return couponRepository
                .findById(id)
                .orElse(null);
    }

    // Update coupon
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCoupon(
            @PathVariable String id,
            @RequestBody Coupon updatedCoupon) {

        Optional<Coupon> existingCoupon =
                couponRepository.findById(id);

        if (existingCoupon.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Coupon not found.");
        }

        Coupon coupon = existingCoupon.get();

        coupon.setCode(
                updatedCoupon
                        .getCode()
                        .trim()
                        .toUpperCase()
        );

        coupon.setDiscountType(
                updatedCoupon.getDiscountType()
        );

        coupon.setDiscountValue(
                updatedCoupon.getDiscountValue()
        );

        coupon.setMinimumOrderAmount(
                updatedCoupon.getMinimumOrderAmount()
        );

        coupon.setExpiryDate(
                updatedCoupon.getExpiryDate()
        );

        coupon.setActive(
                updatedCoupon.isActive()
        );

        return ResponseEntity.ok(
                couponRepository.save(coupon)
        );
    }

    // Validate coupon during checkout
    @GetMapping("/validate")
    public ResponseEntity<?> validateCoupon(
            @RequestParam String code,
            @RequestParam double orderAmount) {

        Optional<Coupon> optionalCoupon =
                couponRepository
                        .findByCodeIgnoreCase(code.trim());

        if (optionalCoupon.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Invalid coupon code.");
        }

        Coupon coupon = optionalCoupon.get();

        if (!coupon.isActive()) {
            return ResponseEntity
                    .badRequest()
                    .body("This coupon is inactive.");
        }

        if (
            coupon.getExpiryDate() != null &&
            coupon.getExpiryDate()
                    .isBefore(LocalDate.now())
        ) {
            return ResponseEntity
                    .badRequest()
                    .body("This coupon has expired.");
        }

        if (
            orderAmount <
            coupon.getMinimumOrderAmount()
        ) {
            return ResponseEntity
                    .badRequest()
                    .body(
                        "Minimum order amount is ₹" +
                        coupon.getMinimumOrderAmount()
                    );
        }

        double discountAmount;

        if (
            "PERCENTAGE".equalsIgnoreCase(
                    coupon.getDiscountType()
            )
        ) {
            discountAmount =
                    orderAmount *
                    coupon.getDiscountValue() / 100;
        } else {
            discountAmount =
                    coupon.getDiscountValue();
        }

        if (discountAmount > orderAmount) {
            discountAmount = orderAmount;
        }

        double finalAmount =
                orderAmount - discountAmount;

        return ResponseEntity.ok(
                new CouponValidationResponse(
                        coupon.getCode(),
                        discountAmount,
                        finalAmount
                )
        );
    }

    // Delete coupon
    @DeleteMapping("/{id}")
    public String deleteCoupon(
            @PathVariable String id) {

        couponRepository.deleteById(id);

        return "Coupon deleted successfully";
    }

    public static class CouponValidationResponse {

        private String code;
        private double discountAmount;
        private double finalAmount;

        public CouponValidationResponse(
                String code,
                double discountAmount,
                double finalAmount) {

            this.code = code;
            this.discountAmount = discountAmount;
            this.finalAmount = finalAmount;
        }

        public String getCode() {
            return code;
        }

        public double getDiscountAmount() {
            return discountAmount;
        }

        public double getFinalAmount() {
            return finalAmount;
        }
    }
}
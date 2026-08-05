package com.foodexpress.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177"
})
public class PaymentController {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(
            @RequestBody Map<String, Object> request) {

        try {
            double amount = Double.parseDouble(
                    request.get("amount").toString()
            );

            if (amount <= 0) {
                return ResponseEntity
                        .badRequest()
                        .body("Payment amount must be greater than zero.");
            }

            RazorpayClient razorpayClient =
                    new RazorpayClient(
                            razorpayKeyId,
                            razorpayKeySecret
                    );

            JSONObject orderRequest = new JSONObject();

            orderRequest.put(
                    "amount",
                    Math.round(amount * 100)
            );

            orderRequest.put("currency", "INR");

            orderRequest.put(
                    "receipt",
                    "foodexpress_" + System.currentTimeMillis()
            );

            Order razorpayOrder =
                    razorpayClient.orders.create(orderRequest);

            Map<String, Object> response = new HashMap<>();

            response.put(
                    "orderId",
                    razorpayOrder.get("id")
            );

            response.put(
                    "amount",
                    razorpayOrder.get("amount")
            );

            response.put(
                    "currency",
                    razorpayOrder.get("currency")
            );

            response.put("keyId", razorpayKeyId);

            return ResponseEntity.ok(response);

        } catch (Exception error) {
            error.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body("Failed to create Razorpay order.");
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
            @RequestBody Map<String, String> request) {

        try {
            String orderId =
                    request.get("razorpayOrderId");

            String paymentId =
                    request.get("razorpayPaymentId");

            String signature =
                    request.get("razorpaySignature");

            if (
                orderId == null ||
                paymentId == null ||
                signature == null
            ) {
                return ResponseEntity
                        .badRequest()
                        .body("Payment details are incomplete.");
            }

            JSONObject verificationData =
                    new JSONObject();

            verificationData.put(
                    "razorpay_order_id",
                    orderId
            );

            verificationData.put(
                    "razorpay_payment_id",
                    paymentId
            );

            verificationData.put(
                    "razorpay_signature",
                    signature
            );

            boolean valid =
                    Utils.verifyPaymentSignature(
                            verificationData,
                            razorpayKeySecret
                    );

            if (!valid) {
                return ResponseEntity
                        .badRequest()
                        .body("Payment verification failed.");
            }

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "message",
                    "Payment verified successfully"
            );

            response.put("paymentId", paymentId);
            response.put("orderId", orderId);

            return ResponseEntity.ok(response);

        } catch (Exception error) {
            error.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body("Payment verification failed.");
        }
    }
}
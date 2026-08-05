package com.foodexpress.backend.controller;

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
import org.springframework.web.bind.annotation.RestController;

import com.foodexpress.backend.model.Order;
import com.foodexpress.backend.model.User;
import com.foodexpress.backend.repository.OrderRepository;
import com.foodexpress.backend.repository.UserRepository;
import com.foodexpress.backend.service.EmailService;
import com.foodexpress.backend.service.FirebaseNotificationService;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177"
})
public class OrderController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final FirebaseNotificationService notificationService;

    public OrderController(
            OrderRepository orderRepository,
            UserRepository userRepository,
            EmailService emailService,
            FirebaseNotificationService notificationService) {

        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.notificationService = notificationService;
    }

    // Place order and send confirmation email
    @PostMapping
    public ResponseEntity<Order> placeOrder(
            @RequestBody Order order) {

        if (
            order.getStatus() == null ||
            order.getStatus().trim().isEmpty()
        ) {
            order.setStatus("Placed");
        }

        Order savedOrder = orderRepository.save(order);

        // Send confirmation email
        if (
            savedOrder.getCustomerEmail() != null &&
            !savedOrder.getCustomerEmail().trim().isEmpty()
        ) {
            try {
                emailService.sendOrderConfirmation(
                        savedOrder.getCustomerEmail(),
                        savedOrder
                );
            } catch (Exception error) {
                System.err.println(
                        "Order saved, but email could not be sent: "
                        + error.getMessage()
                );
            }
        }

        // Send order placed notification
        sendStatusNotification(savedOrder);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedOrder);
    }

    // Get all orders for admin
    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Get one order for tracking
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(
            @PathVariable String id) {

        Optional<Order> order =
                orderRepository.findById(id);

        if (order.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Order not found.");
        }

        return ResponseEntity.ok(order.get());
    }

    // Get customer orders
    @GetMapping("/customer/{customerId}")
    public List<Order> getOrdersByCustomer(
            @PathVariable String customerId) {

        return orderRepository
                .findByCustomerIdOrderByIdDesc(customerId);
    }

    // Update complete order
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(
            @PathVariable String id,
            @RequestBody Order updatedOrder) {

        Optional<Order> existingOrder =
                orderRepository.findById(id);

        if (existingOrder.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Order not found.");
        }

        Order order = existingOrder.get();

        String previousStatus = order.getStatus();

        order.setCustomerId(updatedOrder.getCustomerId());
        order.setCustomerName(updatedOrder.getCustomerName());
        order.setCustomerEmail(
                updatedOrder.getCustomerEmail()
        );
        order.setPhone(updatedOrder.getPhone());
        order.setAddress(updatedOrder.getAddress());
        order.setPaymentMethod(
                updatedOrder.getPaymentMethod()
        );

        order.setPaymentId(updatedOrder.getPaymentId());
        order.setCouponCode(updatedOrder.getCouponCode());
        order.setDiscountAmount(
                updatedOrder.getDiscountAmount()
        );
        order.setFinalAmount(
                updatedOrder.getFinalAmount()
        );

        order.setOrderDate(updatedOrder.getOrderDate());
        order.setFoodName(updatedOrder.getFoodName());
        order.setPrice(updatedOrder.getPrice());
        order.setQuantity(updatedOrder.getQuantity());
        order.setTotal(updatedOrder.getTotal());

        if (
            updatedOrder.getStatus() != null &&
            !updatedOrder.getStatus().trim().isEmpty()
        ) {
            order.setStatus(updatedOrder.getStatus());
        }

        Order savedOrder = orderRepository.save(order);

        if (
            savedOrder.getStatus() != null &&
            !savedOrder.getStatus().equals(previousStatus)
        ) {
            sendStatusNotification(savedOrder);
        }

        return ResponseEntity.ok(savedOrder);
    }

    // Update only order status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable String id,
            @RequestBody String status) {

        Optional<Order> existingOrder =
                orderRepository.findById(id);

        if (existingOrder.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Order not found.");
        }

        String cleanStatus = status
                .replace("\"", "")
                .trim();

        if (
            !cleanStatus.equals("Placed") &&
            !cleanStatus.equals("Preparing") &&
            !cleanStatus.equals("Out for Delivery") &&
            !cleanStatus.equals("Delivered")
        ) {
            return ResponseEntity
                    .badRequest()
                    .body("Invalid order status.");
        }

        Order order = existingOrder.get();
        String previousStatus = order.getStatus();

        order.setStatus(cleanStatus);

        Order savedOrder = orderRepository.save(order);

        if (!cleanStatus.equals(previousStatus)) {
            sendStatusNotification(savedOrder);
        }

        return ResponseEntity.ok(savedOrder);
    }

    // Send Firebase notification to customer
    private void sendStatusNotification(Order order) {

        if (
            order.getCustomerId() == null ||
            order.getCustomerId().trim().isEmpty()
        ) {
            System.err.println(
                    "Notification not sent: customer ID is missing."
            );
            return;
        }

        Optional<User> customer =
                userRepository.findById(
                        order.getCustomerId()
                );

        if (customer.isEmpty()) {
            System.err.println(
                    "Notification not sent: customer not found."
            );
            return;
        }

        String fcmToken = customer.get().getFcmToken();

        if (
            fcmToken == null ||
            fcmToken.trim().isEmpty()
        ) {
            System.err.println(
                    "Notification not sent: FCM token is missing."
            );
            return;
        }

        String title = getNotificationTitle(
                order.getStatus()
        );

        String body = getNotificationBody(order);

        try {
            String messageId =
                    notificationService.sendNotification(
                            fcmToken,
                            title,
                            body
                    );

            System.out.println(
                    "Notification sent successfully: "
                    + messageId
            );

        } catch (Exception error) {
            System.err.println(
                    "Order updated, but notification failed: "
                    + error.getMessage()
            );
        }
    }

    private String getNotificationTitle(String status) {

        if ("Placed".equals(status)) {
            return "Order Placed";
        }

        if ("Preparing".equals(status)) {
            return "Your Food Is Being Prepared";
        }

        if ("Out for Delivery".equals(status)) {
            return "Your Order Is On The Way";
        }

        if ("Delivered".equals(status)) {
            return "Order Delivered";
        }

        return "FoodExpress Order Update";
    }

    private String getNotificationBody(Order order) {

        String foodName =
                order.getFoodName() != null
                        ? order.getFoodName()
                        : "Your food";

        if ("Placed".equals(order.getStatus())) {
            return foodName
                    + " has been ordered successfully.";
        }

        if ("Preparing".equals(order.getStatus())) {
            return foodName
                    + " is currently being prepared.";
        }

        if ("Out for Delivery".equals(order.getStatus())) {
            return foodName
                    + " is out for delivery.";
        }

        if ("Delivered".equals(order.getStatus())) {
            return foodName
                    + " has been delivered. Enjoy your meal!";
        }

        return foodName
                + " status changed to "
                + order.getStatus()
                + ".";
    }

    // Delete order
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(
            @PathVariable String id) {

        if (!orderRepository.existsById(id)) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Order not found.");
        }

        orderRepository.deleteById(id);

        return ResponseEntity.ok(
                "Order deleted successfully."
        );
    }
}
package com.foodexpress.backend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.foodexpress.backend.model.Order;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOrderConfirmation(
            String customerEmail,
            Order order) {

        if (
            customerEmail == null ||
            customerEmail.trim().isEmpty()
        ) {
            return;
        }

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(customerEmail);
        message.setSubject(
                "FoodExpress - Order Confirmed"
        );

        String emailBody =
                "Hello " +
                (
                    order.getCustomerName() != null
                        ? order.getCustomerName()
                        : "Customer"
                ) +
                ",\n\n" +

                "Your order has been placed successfully.\n\n" +

                "Order Details\n" +
                "-----------------------------\n" +
                "Food: " + order.getFoodName() + "\n" +
                "Quantity: " + order.getQuantity() + "\n" +
                "Total: Rs. " +
                String.format(
                    "%.2f",
                    order.getFinalAmount()
                ) +
                "\n" +
                "Payment Method: " +
                order.getPaymentMethod() +
                "\n" +
                "Status: " +
                order.getStatus() +
                "\n\n" +

                "Thank you for ordering with FoodExpress.";

        message.setText(emailBody);

        mailSender.send(message);
    }
}
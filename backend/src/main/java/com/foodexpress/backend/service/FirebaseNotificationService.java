package com.foodexpress.backend.service;

import org.springframework.stereotype.Service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;

@Service
public class FirebaseNotificationService {

    public String sendNotification(
            String token,
            String title,
            String body) {

        if (
            token == null ||
            token.trim().isEmpty()
        ) {
            throw new RuntimeException(
                    "FCM token is missing."
            );
        }

        try {
            Notification notification =
                    Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build();

            Message message =
                    Message.builder()
                            .setToken(token)
                            .setNotification(notification)
                            .putData("title", title)
                            .putData("body", body)
                            .build();

            return FirebaseMessaging
                    .getInstance()
                    .send(message);

        } catch (Exception error) {
            throw new RuntimeException(
                    "Failed to send Firebase notification.",
                    error
            );
        }
    }
}
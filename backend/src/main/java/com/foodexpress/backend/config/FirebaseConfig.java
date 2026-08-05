package com.foodexpress.backend.config;

import java.io.IOException;

import org.springframework.context.annotation.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import jakarta.annotation.PostConstruct;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initialize() {

        try {

            if (!FirebaseApp.getApps().isEmpty()) {
                return;
            }

            GoogleCredentials credentials =
                    GoogleCredentials.fromStream(
                            getClass().getClassLoader()
                                    .getResourceAsStream(
                                            "firebase-service-account.json"
                                    )
                    );

            FirebaseOptions options =
                    FirebaseOptions.builder()
                            .setCredentials(credentials)
                            .build();

            FirebaseApp.initializeApp(options);

            System.out.println(
                    "Firebase initialized successfully."
            );

        } catch (IOException exception) {

            exception.printStackTrace();

            throw new RuntimeException(
                    "Failed to initialize Firebase.",
                    exception
            );
        }
    }
}
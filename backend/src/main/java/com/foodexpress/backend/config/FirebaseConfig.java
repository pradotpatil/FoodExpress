package com.foodexpress.backend.config;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.context.annotation.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import jakarta.annotation.PostConstruct;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initialize() {

        if (!FirebaseApp.getApps().isEmpty()) {
            return;
        }

        try (InputStream credentialsStream =
                     getCredentialsStream()) {

            GoogleCredentials credentials =
                    GoogleCredentials.fromStream(
                            credentialsStream
                    );

            FirebaseOptions options =
                    FirebaseOptions.builder()
                            .setCredentials(credentials)
                            .build();

            FirebaseApp.initializeApp(options);

            System.out.println(
                    "Firebase initialized successfully."
            );

        } catch (IOException error) {
            throw new RuntimeException(
                    "Failed to initialize Firebase: "
                            + error.getMessage(),
                    error
            );
        }
    }

    private InputStream getCredentialsStream()
            throws IOException {

        File renderSecret = new File(
                "/etc/secrets/firebase-service-account.json"
        );

        if (renderSecret.exists()) {
            return new FileInputStream(renderSecret);
        }

        InputStream localFile =
                getClass()
                        .getClassLoader()
                        .getResourceAsStream(
                                "firebase-service-account.json"
                        );

        if (localFile == null) {
            throw new IOException(
                    "Firebase credentials file was not found."
            );
        }

        return localFile;
    }
}
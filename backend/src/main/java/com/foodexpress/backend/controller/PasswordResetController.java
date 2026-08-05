package com.foodexpress.backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodexpress.backend.model.PasswordResetRequest;
import com.foodexpress.backend.service.PasswordResetService;

@RestController
@RequestMapping("/api/auth/password")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177"
})
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    public PasswordResetController(
            PasswordResetService passwordResetService) {

        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/send-code")
    public ResponseEntity<?> sendResetCode(
            @RequestBody Map<String, String> request) {

        try {
            String email = request.get("email");

            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body("Please enter your email.");
            }

            passwordResetService.sendResetCode(
                    email.trim().toLowerCase()
            );

            return ResponseEntity.ok(
                    "Reset code sent successfully."
            );

        } catch (Exception error) {
            return ResponseEntity
                    .badRequest()
                    .body(error.getMessage());
        }
    }

    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(
            @RequestBody PasswordResetRequest request) {

        try {
            if (
                request.getEmail() == null ||
                request.getEmail().trim().isEmpty() ||
                request.getCode() == null ||
                request.getCode().trim().isEmpty() ||
                request.getNewPassword() == null ||
                request.getNewPassword().trim().isEmpty()
            ) {
                return ResponseEntity
                        .badRequest()
                        .body("Please fill all password reset details.");
            }

            if (request.getNewPassword().length() < 6) {
                return ResponseEntity
                        .badRequest()
                        .body(
                            "Password must contain at least 6 characters."
                        );
            }

            passwordResetService.resetPassword(
                    request.getEmail().trim().toLowerCase(),
                    request.getCode().trim(),
                    request.getNewPassword()
            );

            return ResponseEntity.ok(
                    "Password reset successfully."
            );

        } catch (Exception error) {
            return ResponseEntity
                    .badRequest()
                    .body(error.getMessage());
        }
    }
}
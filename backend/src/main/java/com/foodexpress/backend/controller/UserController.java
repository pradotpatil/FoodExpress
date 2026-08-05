package com.foodexpress.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodexpress.backend.model.User;
import com.foodexpress.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177"
})
public class UserController {

    private final UserRepository userRepository;

    public UserController(
            UserRepository userRepository) {

        this.userRepository = userRepository;
    }

    // Get all users
    @GetMapping
    public List<User> getAllUsers() {

        return userRepository
                .findAll()
                .stream()
                .map(user -> {
                    user.setPassword(null);
                    user.setFcmToken(null);
                    return user;
                })
                .collect(Collectors.toList());
    }

    // Update user role
    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(
            @PathVariable String id,
            @RequestBody String role) {

        Optional<User> existingUser =
                userRepository.findById(id);

        if (existingUser.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found.");
        }

        String cleanRole = role
                .replace("\"", "")
                .trim()
                .toUpperCase();

        if (
            !cleanRole.equals("USER") &&
            !cleanRole.equals("ADMIN")
        ) {
            return ResponseEntity
                    .badRequest()
                    .body("Invalid user role.");
        }

        User user = existingUser.get();
        user.setRole(cleanRole);

        User updatedUser =
                userRepository.save(user);

        updatedUser.setPassword(null);
        updatedUser.setFcmToken(null);

        return ResponseEntity.ok(updatedUser);
    }

    // Save or update FCM token
    @PutMapping("/{id}/fcm-token")
    public ResponseEntity<?> updateFcmToken(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {

        Optional<User> existingUser =
                userRepository.findById(id);

        if (existingUser.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found.");
        }

        String fcmToken = request.get("fcmToken");

        if (
            fcmToken == null ||
            fcmToken.trim().isEmpty()
        ) {
            return ResponseEntity
                    .badRequest()
                    .body("FCM token is required.");
        }

        User user = existingUser.get();
        user.setFcmToken(fcmToken.trim());

        userRepository.save(user);

        return ResponseEntity.ok(
                "FCM token saved successfully."
        );
    }

    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(
            @PathVariable String id) {

        if (!userRepository.existsById(id)) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found.");
        }

        userRepository.deleteById(id);

        return ResponseEntity.ok(
                "User deleted successfully."
        );
    }
}
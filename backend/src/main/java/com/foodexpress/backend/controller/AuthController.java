package com.foodexpress.backend.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodexpress.backend.config.JwtService;
import com.foodexpress.backend.model.User;
import com.foodexpress.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177"
})
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(
            @RequestBody User user) {

        if (
            user.getName() == null ||
            user.getName().trim().isEmpty() ||
            user.getEmail() == null ||
            user.getEmail().trim().isEmpty() ||
            user.getPassword() == null ||
            user.getPassword().trim().isEmpty()
        ) {
            return ResponseEntity
                    .badRequest()
                    .body("Please fill all required fields.");
        }

        String email = user.getEmail()
                .trim()
                .toLowerCase();

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Email is already registered.");
        }

        user.setEmail(email);
        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );
        user.setRole("USER");

        User savedUser = userRepository.save(user);

        Map<String, Object> response = new HashMap<>();

        response.put(
                "message",
                "Registration successful"
        );
        response.put("id", savedUser.getId());
        response.put("name", savedUser.getName());
        response.put("email", savedUser.getEmail());
        response.put("role", savedUser.getRole());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
            @RequestBody User loginRequest) {

        if (
            loginRequest.getEmail() == null ||
            loginRequest.getPassword() == null
        ) {
            return ResponseEntity
                    .badRequest()
                    .body("Email and password are required.");
        }

        String email = loginRequest.getEmail()
                .trim()
                .toLowerCase();

        Optional<User> existingUser =
                userRepository.findByEmail(email);

        if (existingUser.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password.");
        }

        User user = existingUser.get();

        if (!passwordEncoder.matches(
                loginRequest.getPassword(),
                user.getPassword())) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password.");
        }

        String token = jwtService.generateToken(user);

        Map<String, Object> response = new HashMap<>();

        response.put("message", "Login successful");
        response.put("token", token);
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());

        return ResponseEntity.ok(response);
    }
}
package com.foodexpress.backend.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.foodexpress.backend.model.User;
import com.foodexpress.backend.repository.UserRepository;

@Service
public class PasswordResetService {

    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final Map<String, ResetCodeData> resetCodes =
            new HashMap<>();

    public PasswordResetService(
            JavaMailSender mailSender,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.mailSender = mailSender;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void sendResetCode(String email) {
        User user = userRepository
                .findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException(
                                "No account found with this email."
                        )
                );

        String code = String.format(
                "%06d",
                new Random().nextInt(1000000)
        );

        resetCodes.put(
                email,
                new ResetCodeData(
                        code,
                        LocalDateTime.now().plusMinutes(10)
                )
        );

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(user.getEmail());
        message.setSubject(
                "FoodExpress Password Reset Code"
        );

        message.setText(
                "Hello " + user.getName() + ",\n\n" +
                "Your password reset code is: " + code + "\n\n" +
                "This code is valid for 10 minutes.\n\n" +
                "If you did not request this, you can ignore this email."
        );

        mailSender.send(message);
    }

    public void resetPassword(
            String email,
            String code,
            String newPassword) {

        ResetCodeData resetData = resetCodes.get(email);

        if (resetData == null) {
            throw new RuntimeException(
                    "No reset request found."
            );
        }

        if (LocalDateTime.now().isAfter(
                resetData.getExpiryTime()
        )) {
            resetCodes.remove(email);

            throw new RuntimeException(
                    "Reset code has expired."
            );
        }

        if (!resetData.getCode().equals(code)) {
            throw new RuntimeException(
                    "Invalid reset code."
            );
        }

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found."
                        )
                );

        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        userRepository.save(user);
        resetCodes.remove(email);
    }

    private static class ResetCodeData {

        private final String code;
        private final LocalDateTime expiryTime;

        public ResetCodeData(
                String code,
                LocalDateTime expiryTime) {

            this.code = code;
            this.expiryTime = expiryTime;
        }

        public String getCode() {
            return code;
        }

        public LocalDateTime getExpiryTime() {
            return expiryTime;
        }
    }
}
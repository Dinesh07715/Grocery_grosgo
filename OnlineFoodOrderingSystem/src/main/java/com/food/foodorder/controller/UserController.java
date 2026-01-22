package com.food.foodorder.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import com.food.foodorder.dto.LoginRequest;
import com.food.foodorder.dto.LoginResponse;
import com.food.foodorder.dto.RegisterRequest;
import com.food.foodorder.entity.User;
import com.food.foodorder.security.JwtUtil;
import com.food.foodorder.service.UserService;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = userService.login(
                request.getEmail(),
                request.getPassword()
            );

            String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole()
            );

            return ResponseEntity.ok(new LoginResponse(token, user));
            
        } catch (Exception e) {
            System.err.println("❌ Login error: " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    // ✅ REGISTER - WITH PROPER ERROR HANDLING
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            System.out.println("📝 Registration attempt:");
            System.out.println("   Name: " + request.getName());
            System.out.println("   Email: " + request.getEmail());
            System.out.println("   Password length: " + (request.getPassword() != null ? request.getPassword().length() : "null"));

            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPassword(request.getPassword());
            user.setCreatedAt(LocalDateTime.now());
            user.setRole(request.getRole());


            User savedUser = userService.registerUser(user);
            System.out.println("✅ User registered successfully: " + savedUser.getEmail());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
            
        } catch (RuntimeException e) {
            System.err.println("❌ Registration error: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            
            // Return 409 for duplicate email, 400 for other errors
            if (e.getMessage().contains("already exists")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
            }
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            
        } catch (Exception e) {
            System.err.println("❌ Unexpected error: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, String> error = new HashMap<>();
            error.put("message", "Registration failed. Please try again.");
            error.put("error", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // ✅ GET USER BY EMAIL
    @GetMapping("/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        try {
            User user = userService.getUserByEmail(email);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    // ✅ GET USER PROFILE (JWT BASED)
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.getUserWithAddress(email);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    // ✅ UPDATE USER ADDRESS (JWT BASED)
    @PutMapping("/address")
    public ResponseEntity<?> updateUserAddress(
            @RequestBody Map<String, String> addressData,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User updatedUser = userService.updateUserAddress(
                email,
                addressData.get("address"),
                addressData.get("city"),
                addressData.get("state"),
                addressData.get("pincode"),
                addressData.get("phone")
            );
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}

package com.food.foodorder.dto;

import com.food.foodorder.entity.User;

public class LoginResponse {

    private String token;
    private User user;

    // ✅ REQUIRED CONSTRUCTOR
    public LoginResponse(String token, User user) {
        this.token = token;
        this.user = user;
    }

    // ✅ Getters & Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}

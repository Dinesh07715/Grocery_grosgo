package com.food.foodorder.dto;

public class LoginRequest {

    private String email;
    private String password;

    // 🔴 DEFAULT CONSTRUCTOR (MANDATORY)
    public LoginRequest() {}

    // ✅ GETTERS
    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    // ✅ SETTERS
    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

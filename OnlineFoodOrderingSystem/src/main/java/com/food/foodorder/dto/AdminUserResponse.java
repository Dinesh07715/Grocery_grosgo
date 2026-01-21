package com.food.foodorder.dto;

public class AdminUserResponse {

    private Long id;
    private String name;
    private String email;
    private String status;
    private long orders;
    private double spent;

    public AdminUserResponse(
            Long id,
            String name,
            String email,
            String status,
            long orders,
            double spent
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.status = status;
        this.orders = orders;
        this.spent = spent;
    }

    // getters only (no setters needed)
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getStatus() { return status; }
    public long getOrders() { return orders; }
    public double getSpent() { return spent; }
}

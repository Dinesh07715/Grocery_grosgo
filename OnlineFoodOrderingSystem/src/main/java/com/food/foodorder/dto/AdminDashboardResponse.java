package com.food.foodorder.dto;

import java.util.List;
import java.time.LocalDateTime;

public class AdminDashboardResponse {

    private long totalUsers;
    private long totalOrders;
    private long totalProducts;
    private double totalRevenue;
    private List<RecentOrder> recentOrders;

    public static class RecentOrder {
        public Long orderId;
        public String userEmail;
        public double amount;
        public String status;
        public LocalDateTime createdAt;

        public RecentOrder(Long orderId, String userEmail, double amount, String status, LocalDateTime createdAt) {
            this.orderId = orderId;
            this.userEmail = userEmail;
            this.amount = amount;
            this.status = status;
            this.createdAt = createdAt;
        }
    }

    // getters & setters
    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }

    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }

    public List<RecentOrder> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<RecentOrder> recentOrders) { this.recentOrders = recentOrders; }
}

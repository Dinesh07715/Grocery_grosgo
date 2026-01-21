package com.food.foodorder.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.*;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    // Convenience field for existing code/JSON; populated from the same column.
    @Column(name = "user_id", insertable = false, updatable = false)
    private Integer userId;

    @Column(nullable = false)
    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private LocalDateTime orderDate;

    @Column(length = 500)
    private String deliveryAddress;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "order_status_timeline",
        joinColumns = @JoinColumn(name = "order_id")
    )
    @MapKeyColumn(name = "status")
    @Column(name = "status_time")
    private Map<String, LocalDateTime> statusTimeline = new HashMap<>();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<OrderItem> orderItems = new ArrayList<>();

    public Order() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public Map<String, LocalDateTime> getStatusTimeline() { return statusTimeline; }
    public void setStatusTimeline(Map<String, LocalDateTime> statusTimeline) {
        this.statusTimeline = statusTimeline;
    }

    public List<OrderItem> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }
}

package com.food.foodorder.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonBackReference
    private Order order;

    // 🔥 THIS MUST EXIST
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "food_id", nullable = false)
    private Food food;

    @Column(nullable = false)
    private Double price;
    
    @Column(nullable = false)
    private long quantity;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;


    // 🔥 MISSING FIELD (THIS IS THE BUG)
    @Column(name = "product_name", nullable = false)
    private String productName;

    // getters and setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Food getFood() {
        return food;
    }

    public void setFood(Food food) {
        this.food = food;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Long getQuantity() {
        return quantity;
    }

    public void setQuantity(long quantity2) {
        this.quantity = quantity2;
    }

    public String getImageUrl() {
        return imageUrl;
    }
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }
}



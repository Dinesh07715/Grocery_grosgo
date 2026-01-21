package com.food.foodorder.service;

import java.util.List;

import com.food.foodorder.dto.PlaceOrderRequest;
import com.food.foodorder.entity.Order;
import com.food.foodorder.entity.OrderItem;

public interface OrderService {

    // USER (JWT based)
    Order placeOrder(String email, PlaceOrderRequest request);

    // USER → own orders
    List<Order> getOrdersByUserEmail(String email);

    // ADMIN → orders by userId
    List<Order> getOrdersByUser(Long userId);

    // USER / ADMIN → order items (basic)
    List<OrderItem> getOrderItems(Long orderId);

    // 🔒 SECURE: USER only own orders, ADMIN all
    List<OrderItem> getOrderItemsSecure(Long orderId, String loggedInEmail);

    // 🔒 SECURE: USER only own orders, ADMIN all
    Order getOrderByIdSecure(Long orderId, String loggedInEmail, boolean isAdmin);

    // ADMIN → update order status
    Order updateOrderStatus(Long orderId, String newstatus);
    
    Order getOrderById(Long orderId);

    // ADMIN → all orders
    List<Order> getAllOrders();

    


   

}

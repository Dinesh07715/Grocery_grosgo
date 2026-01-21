package com.food.foodorder.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.food.foodorder.dto.PlaceOrderRequest;
import com.food.foodorder.entity.CartItem;
import com.food.foodorder.entity.Food;
import com.food.foodorder.entity.Order;
import com.food.foodorder.entity.OrderItem;
import com.food.foodorder.entity.OrderStatus;
import com.food.foodorder.entity.User;
import com.food.foodorder.exception.BadRequestException;
import com.food.foodorder.exception.ResourceNotFoundException;
import com.food.foodorder.repository.CartRepository;
import com.food.foodorder.repository.FoodRepository;
import com.food.foodorder.repository.OrderItemRepository;
import com.food.foodorder.repository.OrderRepository;
import com.food.foodorder.repository.UserRepository;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    // ======================================================
    // PLACE ORDER
    // ======================================================
    @Override
    @Transactional
    public Order placeOrder(String email, PlaceOrderRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<CartItem> cartItems = cartRepository.findByUserId(user.getId());

        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PLACED);
order.setOrderDate(LocalDateTime.now());
order.setDeliveryAddress(request.getDeliveryAddress());

double total = 0.0;
List<OrderItem> orderItems = new ArrayList<>();

for (CartItem c : cartItems) {

    Food food = c.getFood();
    if (food == null) {
        throw new BadRequestException("Food not found in cart");
    }

    double price = food.getPrice();   // ✅ FIX IS HERE
    long quantity = c.getQuantity();

    if (food.getStock() < quantity) {
        throw new BadRequestException(
            "Insufficient stock for " + food.getName()
        );
    }

    // Reduce stock
    food.setStock(food.getStock() - quantity);
    foodRepository.save(food);

    OrderItem oi = new OrderItem();
    oi.setFood(food);
    oi.setQuantity(quantity);
    oi.setPrice(price);               // ✅ now works

    // snapshot fields
    oi.setImageUrl(c.getFood().getImageUrl());
    oi.setProductName(food.getName());

    oi.setOrder(order);
    orderItems.add(oi);

    total += price * quantity;         // ✅ now works
}


order.setTotalAmount(total);

// ✅ THIS IS THE FIX (VERY IMPORTANT)
order.setOrderItems(orderItems);
for (OrderItem oi : orderItems) {
    oi.setOrder(order);
}

// ✅ Save ONCE
Order savedOrder = orderRepository.save(order);

        for (OrderItem item : orderItems) {
            item.setOrder(savedOrder);
            orderItemRepository.save(item);
        }

        savedOrder.setOrderItems(orderItems);

        cartRepository.deleteByUserId(user.getId());

        try {
            emailService.sendOrderPlacedEmail(savedOrder, user.getEmail());
        } catch (Exception ignored) {}

        return savedOrder;
    }

    // ======================================================
    // USER ORDERS
    // ======================================================
    @Override
    @Transactional(readOnly = true)
    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUser_IdOrderByOrderDateDesc(userId);
    }

    // ======================================================
    // ORDER ITEMS
    // ======================================================
    @Override
    @Transactional(readOnly = true)
    public List<OrderItem> getOrderItems(Long orderId) {
        return orderItemRepository.findByOrder_Id(orderId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderItem> getOrderItemsSecure(Long orderId, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean ownsOrder = orderRepository.existsByIdAndUser_Id(
                orderId,
                user.getId()
        );

        if (!ownsOrder) {
            throw new ResourceNotFoundException("Order not found");
        }

        return orderItemRepository.findByOrder_Id(orderId);
    }

    // ======================================================
    // GET ORDER (SECURE)
    // ======================================================
    @Override
    @Transactional(readOnly = true)
    public Order getOrderByIdSecure(Long orderId, String email, boolean isAdmin) {

        if (isAdmin) {
            return getOrderById(orderId);
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean owns = orderRepository.existsByIdAndUser_Id(
                orderId,
                user.getId()
        );

        if (!owns) {
            throw new ResourceNotFoundException("Order not found");
        }

        return getOrderById(orderId);
    }

    // ======================================================
    // UPDATE ORDER STATUS (ADMIN)
    // ======================================================
    @Override
    @Transactional
    public Order updateOrderStatus(Long orderId, String newStatus) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        OrderStatus status;
        try {
            status = OrderStatus.valueOf(newStatus.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid order status");
        }

        order.setStatus(status);
        Order updated = orderRepository.save(order);

        try {
            emailService.sendOrderStatusUpdateEmail(updated, order.getUser().getEmail(), newStatus);
        } catch (Exception ignored) {}

        return updated;
    }

    // ======================================================
    // GET ORDER BY ID
    // ======================================================
    @Override
    @Transactional(readOnly = true)
    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    // ======================================================
    // ADMIN → ALL ORDERS
    // ======================================================
    @Override
    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }


    @Override
@Transactional(readOnly = true)
public List<Order> getOrdersByUserEmail(String email) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    return orderRepository.findByUser_IdOrderByOrderDateDesc(user.getId());
}

}

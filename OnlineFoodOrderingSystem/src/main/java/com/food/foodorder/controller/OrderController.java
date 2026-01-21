package com.food.foodorder.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.food.foodorder.dto.PlaceOrderRequest;
import com.food.foodorder.entity.Order;
import com.food.foodorder.entity.OrderItem;
import com.food.foodorder.service.OrderService;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    private boolean isAdmin(Authentication authentication) {
        return authentication != null
                && authentication.getAuthorities() != null
                && authentication.getAuthorities().stream()
                    .anyMatch(a -> "ADMIN".equals(a.getAuthority()));
    }

    // ✅ PLACE ORDER
    @PostMapping("/place")
    public Order placeOrder(@RequestBody PlaceOrderRequest request, Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("Authentication required");
        }
        return orderService.placeOrder(authentication.getName(), request);
    }

    // ✅ USER → My Orders
    @GetMapping("/my")
    public List<Order> getMyOrders(Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("Unauthorized");
        }
        String email = authentication.getName();
        return orderService.getOrdersByUserEmail(email);
    }

    // ✅ USER/ADMIN → Get single order (View Details)
    @GetMapping("/{orderId}")
    public Order getOrderById(@PathVariable Long orderId, Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("Unauthorized");
        }
        return orderService.getOrderByIdSecure(orderId, authentication.getName(), isAdmin(authentication));
    }

    // ✅ USER/ADMIN → Order Items
    @GetMapping("/{orderId}/items")
    public List<OrderItem> getOrderItems(@PathVariable Long  orderId, Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("Unauthorized");
        }
        if (isAdmin(authentication)) {
            return orderService.getOrderItems(orderId);
        }
        return orderService.getOrderItemsSecure(orderId, authentication.getName());
    }

    // ✅ ADMIN → Update Status (ORIGINAL format: /status/58)
   @PutMapping("/{orderId}/status")
public Order updateOrderStatus(
        @PathVariable Long orderId,
        @RequestParam String status,
        Authentication authentication
) {
    if (!isAdmin(authentication)) {
        throw new RuntimeException("Admin access required");
    }
    System.out.println("✅ ADMIN STATUS UPDATE: Order " + orderId + " → " + status + " by " + authentication.getName());
    return orderService.updateOrderStatus(orderId, status);
}


    // 🔥 NEW ENDPOINT - Matches Frontend AdminOrderDetail.jsx
    // @PutMapping("/{orderId}/status")
    // public Order updateOrderStatusV2(@PathVariable Integer orderId, @RequestParam String status, Authentication authentication) {
    //     if (!isAdmin(authentication)) {
    //         throw new RuntimeException("Admin access required");
    //     }
    //     System.out.println("🔥 STATUS UPDATE 2: Order " + orderId + " → " + status + " by " + authentication.getName());
    //     return orderService.updateOrderStatus(orderId, status);
    // }

    // ✅ FIXED: ALL ORDERS - Works for ADMIN + logged-in users (FIXES 403)
    @GetMapping
    public List<Order> getAllOrders(Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("Authentication required");
        }
        
        // ✅ ADMIN sees ALL orders, USERS see their orders only
        String userEmail = authentication.getName();
        System.out.println("📦 Orders requested by: " + userEmail + " (Admin: " + isAdmin(authentication) + ")");
        
        if (isAdmin(authentication)) {
            return orderService.getAllOrders();
        } else {
            return orderService.getOrdersByUserEmail(userEmail);
        }
    }

    // 🔥 ADMIN-ONLY endpoint (alternative)
    @GetMapping("/admin")
    public List<Order> getAllOrdersAdmin(Authentication authentication) {
        if (!isAdmin(authentication)) {
            throw new RuntimeException("Admin access required");
        }
        System.out.println("🔥 ADMIN " + authentication.getName() + " viewing ALL orders");
        return orderService.getAllOrders();
    }

    // ✅ TEST endpoint
    @GetMapping("/test")
    public String test(Authentication authentication) {
        return "ORDER CONTROLLER ✅ WORKING - User: " + (authentication != null ? authentication.getName() : "No auth");
    }
}

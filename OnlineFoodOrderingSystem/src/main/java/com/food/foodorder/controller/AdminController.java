package com.food.foodorder.controller;

import com.food.foodorder.dto.AdminDashboardResponse;
import com.food.foodorder.entity.Order;
import com.food.foodorder.entity.OrderItem;
import com.food.foodorder.entity.User;
import com.food.foodorder.service.AdminDashboardService;
import com.food.foodorder.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.food.foodorder.service.OrderService;
import java.util.List;


@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminDashboardService dashboardService;
    private final UserService userService;
    private final OrderService orderService;

    public AdminController(
            AdminDashboardService dashboardService,
            UserService userService,
            OrderService orderService
    ) {
        this.dashboardService = dashboardService;
        this.userService = userService;
        this.orderService = orderService;
    }

    // ✅ ADMIN DASHBOARD
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/dashboard")
    public AdminDashboardResponse getDashboard() {
        return dashboardService.getDashboardData();
    }

    // ✅ ADMIN → GET ALL USERS
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }


    // ✅ ADMIN → UPDATE USER STATUS (BLOCK / UNBLOCK)
@PreAuthorize("hasRole('ADMIN')")
@PutMapping("/users/{id}/status")
public void updateUserStatus(
        @PathVariable Long id,
        @RequestBody User userPayload
) {
    userService.updateUserStatus(id, userPayload.getStatus());
}

@PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/orders/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }



    @PreAuthorize("hasRole('ADMIN')")
@PutMapping("/orders/{orderId}/status")
public Order adminUpdateOrderStatus(
        @PathVariable Long orderId,
        @RequestParam String status
) {
    return orderService.updateOrderStatus(orderId, status);
}

@PreAuthorize("hasRole('ADMIN')")
@GetMapping("/orders/{orderId}/items")
public List<OrderItem> getOrderItemsForAdmin(
        @PathVariable Long orderId
) {
    return orderService.getOrderItems(orderId);
}
@PreAuthorize("hasRole('ADMIN')")
@GetMapping("/users/details")
public List<User> getAllUsersWithDetails() {
    return userService.getAllUsersWithDetails();
}


}

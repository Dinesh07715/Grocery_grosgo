package com.food.foodorder.service;

import com.food.foodorder.dto.AdminDashboardResponse;
import com.food.foodorder.dto.AdminDashboardResponse.RecentOrder;
import com.food.foodorder.entity.Order;
import com.food.foodorder.repository.OrderRepository;
import com.food.foodorder.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public AdminDashboardService(
            UserRepository userRepository,
            OrderRepository orderRepository
    ) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    public AdminDashboardResponse getDashboardData() {

        AdminDashboardResponse response = new AdminDashboardResponse();

        // ✅ Total users
        response.setTotalUsers(userRepository.count());

        // ✅ Get ALL orders
        List<Order> orders = orderRepository.findAll();

        // ✅ Total orders
        response.setTotalOrders(orders.size());

        // ✅ Total revenue (calculate in service)
        double totalRevenue = orders.stream()
                .filter(o -> o.getStatus() != null
                        && "DELIVERED".equalsIgnoreCase(o.getStatus().toString()))
                .mapToDouble(Order::getTotalAmount)
                .sum();

        response.setTotalRevenue(totalRevenue);

        // ✅ All orders for dashboard table
        response.setRecentOrders(
                orders.stream()
                        .map(o -> new RecentOrder(
                                o.getId().longValue(),          // Integer → Long
                                o.getUser().getEmail(),
                                o.getTotalAmount(),
                                o.getStatus().toString(),
                                o.getOrderDate()                // ✔ matches your entity
                        ))
                        .collect(Collectors.toList())
        );

        return response;
    }
}

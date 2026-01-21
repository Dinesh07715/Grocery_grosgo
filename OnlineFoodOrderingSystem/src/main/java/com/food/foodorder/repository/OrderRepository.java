package com.food.foodorder.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.food.foodorder.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // Existing methods
    List<Order> findByUser_IdOrderByOrderDateDesc(Long userId);

    boolean existsByIdAndUser_Id(Long id, Long userId);

    // ============================
    // ✅ ADD THESE TWO METHODS
    // ============================

    // Count total orders per user
    long countByUser_Id(Long userId);

    // Calculate total money spent by user
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.user.id = :userId")
    Double getTotalSpentByUser(@Param("userId") Long userId);
}

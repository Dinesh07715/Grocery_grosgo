package com.food.foodorder.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.food.foodorder.entity.Food;

public interface FoodRepository extends JpaRepository<Food, Long> {

    // 🔹 Custom method (NO SQL written by you)
    List<Food> findByCategory(String category);

    // 🔹 Search method for products by name or category
    @Query("SELECT f FROM Food f WHERE LOWER(f.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(f.category) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Food> searchFoods(@Param("query") String query);
}

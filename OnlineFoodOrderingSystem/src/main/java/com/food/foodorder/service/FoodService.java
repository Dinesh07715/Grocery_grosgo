package com.food.foodorder.service;

import java.util.List;
import com.food.foodorder.entity.Food;

public interface FoodService {

    Food addFood(Food food);

    List<Food> getAllFoods();

    Food getFoodById(Long id);
    
    Food updateFood(Long id, Food food);


    void deleteFood(Long id);

    List<Food> getFoodByCategory(String category);

    // ✅ ADD THIS
    List<Food> addAllFoods(List<Food> foods);

    // ✅ Search foods by query
    List<Food> searchFoods(String query);
}

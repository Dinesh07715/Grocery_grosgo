package com.food.foodorder.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.food.foodorder.entity.Food;
import com.food.foodorder.service.FoodService;

@RestController
@RequestMapping("/api/foods")
@CrossOrigin(origins = "*")
public class FoodController {

    @Autowired
    private FoodService foodService;

    // ✅ Add single food
    @PostMapping("/add")
    public Food addFood(@RequestBody Food food) {
        return foodService.addFood(food);
    }

    // ✅ Add multiple foods
    @PostMapping("/add-all")
    public List<Food> addAllFoods(@RequestBody List<Food> foods) {
        return foodService.addAllFoods(foods);
    }

    // ✅ Get all foods
    @GetMapping("/all")
    public List<Food> getAllFoods() {
        return foodService.getAllFoods();
    }

    // ✅ Get food by id
    @GetMapping("/{id}")
    public Food getFoodById(@PathVariable Long id) {
        return foodService.getFoodById(id);
    }
 // ✅ Get foods by category  🔥 ADD HERE
    @GetMapping("/category/{category}")
    public List<Food> getFoodsByCategory(@PathVariable String category) {
        return foodService.getFoodByCategory(category);
    }
    
 // ✅ Update food
    @PutMapping("/update/{id}")
    public Food updateFood(@PathVariable Long id, @RequestBody Food food) {
        return foodService.updateFood(id, food);
    }


    // ✅ Delete food
    @DeleteMapping("/delete/{id}")
    public String deleteFood(@PathVariable Long id) {
        foodService.deleteFood(id);
        return "Food deleted successfully";
    }

    // ✅ Search foods
    @GetMapping("/search")
    public List<Food> searchFoods(@RequestParam String q) {
        return foodService.searchFoods(q);
    }
}

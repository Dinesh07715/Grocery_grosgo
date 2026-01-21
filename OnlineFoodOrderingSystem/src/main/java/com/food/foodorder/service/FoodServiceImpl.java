package com.food.foodorder.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.food.foodorder.entity.Food;
import com.food.foodorder.repository.FoodRepository;

@Service
public class FoodServiceImpl implements FoodService {

    @Autowired
    private FoodRepository foodRepository;

    @Override
    public Food addFood(Food food) {
        return foodRepository.save(food);
    }

    @Override
    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

    @Override
    public Food getFoodById(Long id) {
        return foodRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteFood(Long id) {
        foodRepository.deleteById(id);
    }

    @Override
    public List<Food> getFoodByCategory(String category) {
        return foodRepository.findByCategory(category);
    }

    // ✅ MULTIPLE INSERT
    @Override
    public List<Food> addAllFoods(List<Food> foods) {
        return foodRepository.saveAll(foods);
        
    }
    
    @Override
    public Food updateFood(Long id, Food food) {

        Food existingFood = foodRepository.findById(id).orElse(null);

        if (existingFood != null) {
            existingFood.setName(food.getName());
            existingFood.setDescription(food.getDescription());
            existingFood.setPrice(food.getPrice());
            existingFood.setCategory(food.getCategory());
           // existingFood.setImageUrl(food.getImageUrl());

            return foodRepository.save(existingFood);
        }

        return null;
    }

    @Override
    public List<Food> searchFoods(String query) {
        return foodRepository.searchFoods(query);
    }

    // @Override
    // public Food getFoodById(Long id) {
    //     // TODO Auto-generated method stub
    //     throw new UnsupportedOperationException("Unimplemented method 'getFoodById'");
    // }

    // @Override
    // public void deleteFood(Long id) {
    //     // TODO Auto-generated method stub
    //     throw new UnsupportedOperationException("Unimplemented method 'deleteFood'");
    // }

}


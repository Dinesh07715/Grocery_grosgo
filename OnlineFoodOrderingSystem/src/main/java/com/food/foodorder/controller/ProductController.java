package com.food.foodorder.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.food.foodorder.entity.Food;
import com.food.foodorder.repository.FoodRepository;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ProductController {

    private final FoodRepository foodRepository;

    public ProductController(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }

    @GetMapping
    public List<Food> getProducts() {
        return foodRepository.findAll();
    }
}


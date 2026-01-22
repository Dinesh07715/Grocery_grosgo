package com.food.foodorder.controller;

import com.food.foodorder.entity.Food;
import com.food.foodorder.repository.FoodRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/products")
@CrossOrigin("*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {

    private final FoodRepository foodRepository;

    public AdminProductController(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }

    @GetMapping
    public List<Food> getAllProducts() {
        return foodRepository.findAll();
    }

    @PostMapping
    public Food addProduct(@RequestBody Food food) {
        food.setId(null);
        return foodRepository.save(food);
    }

    @PutMapping("/{id}")
    public Food updateProduct(
            @PathVariable Long id,
            @RequestBody Food food
    ) {
        Food existing = foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        existing.setName(food.getName());
        existing.setPrice(food.getPrice());
        existing.setStock(food.getStock());
        existing.setCategory(food.getCategory());
        existing.setStatus(food.getStatus());
        existing.setActive(food.isActive());

        return foodRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        foodRepository.deleteById(id);
    }
}

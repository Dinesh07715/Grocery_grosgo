package com.food.foodorder.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.food.foodorder.entity.Cart;
import com.food.foodorder.entity.CartItem;
import com.food.foodorder.entity.User;

public interface CartRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUserId(Long userId);

    // ✅ ADD: Find existing cart item by user and food
    CartItem findByUserIdAndFood_Id(Long userId, Long foodId);

//    Cart findByUser(User user);
//    Cart findByUserId(Integer userId);
    //List<CartItem> findByUserEmail(String email);
    void deleteByUserId(Long userId);

}

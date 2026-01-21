package com.food.foodorder.service;

import java.util.List;
import com.food.foodorder.dto.CartItemResponse;
import com.food.foodorder.dto.CartRequest;
import com.food.foodorder.dto.CartResponse;

public interface CartService {

    CartResponse addToCart(CartRequest request, String email);

    CartResponse getCart(String email);

    CartResponse updateCartItem(Long itemId, Long
         quantity, String email);

    CartResponse removeItem(Long id, String email);

    void clearCart(String email);
}

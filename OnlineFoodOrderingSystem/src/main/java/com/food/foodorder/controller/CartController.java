package com.food.foodorder.controller;

import java.util.List;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.food.foodorder.entity.CartItem;
import com.food.foodorder.service.CartService;

import com.food.foodorder.dto.CartItemResponse;
import com.food.foodorder.dto.CartRequest;
import com.food.foodorder.dto.CartResponse;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin("*")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public CartResponse addToCart(
            @RequestBody CartRequest request,
            Authentication authentication) {

        return cartService.addToCart(request, authentication.getName());
    }

    @GetMapping("/my")
    public List<CartItemResponse> getMyCart(Authentication authentication) {
        return cartService.getMyCart(authentication.getName());
    }

    @PutMapping("/update/{itemId}")
    public CartResponse updateCartItem(
            @PathVariable Long itemId,
            @RequestBody CartRequest request,
            Authentication authentication) {

        return cartService.updateCartItem(
                itemId,
                request.getQuantity().longValue(),
                authentication.getName()
        );
    }

    @DeleteMapping("/remove/{id}")
    public CartResponse removeItem(
            @PathVariable Long id,
            Authentication authentication) {

        return cartService.removeItem(id, authentication.getName());
    }

    @DeleteMapping("/clear")
    public String clearCart(Authentication authentication) {
        cartService.clearCart(authentication.getName());
        return "Cart cleared successfully";
    }
}

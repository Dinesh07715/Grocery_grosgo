package com.food.foodorder.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.food.foodorder.dto.CartItemResponse;
import com.food.foodorder.dto.CartRequest;
import com.food.foodorder.dto.CartResponse;
import com.food.foodorder.entity.CartItem;
import com.food.foodorder.entity.Food;
import com.food.foodorder.entity.User;
import com.food.foodorder.repository.CartRepository;
import com.food.foodorder.repository.FoodRepository;
import com.food.foodorder.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FoodRepository foodRepository;

    // ================= ADD TO CART =================
    @Override
    public CartResponse addToCart(CartRequest request, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "User not found"));

        Food food = foodRepository.findById(request.getFoodId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Food not found with id: " + request.getFoodId()));

        CartItem existing =
                cartRepository.findByUserIdAndFood_Id(user.getId(), food.getId());

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + request.getQuantity());
            cartRepository.save(existing);
        } else {
            CartItem cartItem = new CartItem();
            cartItem.setUserId(user.getId());
            cartItem.setFood(food);
            cartItem.setQuantity(request.getQuantity());
            cartItem.setFoodName(food.getName());
            cartItem.setPrice(food.getPrice());
            cartRepository.save(cartItem);
        }

        return buildCartResponse(user.getId());
    }

    // ================= GET MY CART =================
    @Override
    public List<CartItemResponse> getMyCart(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "User not found"));

        return cartRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToItemResponse)
                .collect(Collectors.toList());
    }

    // ================= UPDATE CART ITEM =================
    @Override
    public CartResponse updateCartItem(Long itemId, Long quantity, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "User not found"));

        CartItem item = cartRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Cart item not found"));

        if (!item.getUserId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        if (quantity <= 0) {
            cartRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartRepository.save(item);
        }

        return buildCartResponse(user.getId());
    }

    // ================= REMOVE SINGLE ITEM =================
    @Override
    public CartResponse removeItem(Long id, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "User not found"));

        CartItem item = cartRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Cart item not found"));

        if (!item.getUserId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        cartRepository.delete(item);
        return buildCartResponse(user.getId());
    }

    // ================= CLEAR CART =================
    @Override
    @Transactional
    public void clearCart(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "User not found"));

        cartRepository.deleteByUserId(user.getId());
    }

    // ================= CART RESPONSE BUILDER =================
    private CartResponse buildCartResponse(Long userId) {

        List<CartItemResponse> items = cartRepository.findByUserId(userId)
                .stream()
                .map(this::mapToItemResponse)
                .toList();

        double totalAmount = items.stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();

        CartResponse response = new CartResponse();
        response.setItems(items);
        response.setTotalItems(items.size());
        response.setTotalAmount(totalAmount);

        return response;
    }

    // ================= ITEM MAPPER =================
    private CartItemResponse mapToItemResponse(CartItem item) {

        Food food = item.getFood();

        CartItemResponse dto = new CartItemResponse();
        dto.setId(item.getId());
        dto.setProductId(food.getId());
        dto.setName(food.getName());
        dto.setQuantity(item.getQuantity());
        dto.setPrice(food.getPrice());
        dto.setImageUrl(food.getImageUrl());
        dto.setStock(food.getStock());

        return dto;
    }
}

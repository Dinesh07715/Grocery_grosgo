package com.food.foodorder.service;

import com.food.foodorder.entity.User;
import java.util.List;

public interface UserService {

    User registerUser(User user);

    User getUserByEmail(String email);

    User login(String email, String password);

    // ✅ Address management
    User updateUserAddress(
        String email,
        String address,
        String city,
        String state,
        String pincode,
        String phone
    );

    User getUserWithAddress(String email);

    // ✅ ADMIN: Fetch all users
    List<User> getAllUsers();

    List<User> getAllUsersWithDetails();


    void updateUserStatus(Long userId, String status);

    

}

package com.food.foodorder.service;

import com.food.foodorder.entity.User;
import com.food.foodorder.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User registerUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public User login(String email, String password) {
        User user = getUserByEmail(email);
        // password validation logic here
        return user;
    }

    @Override
    public User updateUserAddress(
            String email,
            String address,
            String city,
            String state,
            String pincode,
            String phone
    ) {
        User user = getUserByEmail(email);
        user.setAddress(address);
        user.setCity(city);
        user.setState(state);
        user.setPincode(pincode);
        user.setPhone(phone);
        return userRepository.save(user);
    }

    @Override
    public User getUserWithAddress(String email) {
        return getUserByEmail(email);
    }

    // ✅ ADMIN METHOD
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public void updateUserStatus(Long userId, String status) {  
        
        Integer id = userId.intValue(); // ✅ FIX HERE

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"active".equalsIgnoreCase(status) &&
            !"blocked".equalsIgnoreCase(status)) {
            throw new IllegalArgumentException("Invalid status");
        }

        user.setStatus(status.toLowerCase());
        userRepository.save(user);
    }

    @Override
public List<User> getAllUsersWithDetails() {
    List<User> users = userRepository.findAll();

    // 🔥 FORCE load orders to avoid LAZY issues
    for (User user : users) {
        if (user.getOrders() != null) {
            user.getOrders().size(); // triggers Hibernate load
        }
    }
    return users;
}

}

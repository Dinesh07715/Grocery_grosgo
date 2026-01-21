package com.food.foodorder.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.food.foodorder.entity.User;

import jakarta.persistence.Column;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);
    
   

}

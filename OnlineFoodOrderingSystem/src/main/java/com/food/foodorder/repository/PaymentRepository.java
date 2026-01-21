package com.food.foodorder.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.food.foodorder.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
	Optional<Payment> findTopByOrderIdOrderByIdDesc(Long orderId);
}

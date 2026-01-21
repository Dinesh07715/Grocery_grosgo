package com.food.foodorder.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.food.foodorder.entity.Cart;
import com.food.foodorder.entity.Order;
import com.food.foodorder.entity.OrderStatus;
import com.food.foodorder.entity.Payment;
import com.food.foodorder.entity.PaymentStatus;
import com.food.foodorder.entity.User;
import com.food.foodorder.exception.ForbiddenException;
import com.food.foodorder.exception.ResourceNotFoundException;
import com.food.foodorder.repository.CartRepository;
import com.food.foodorder.repository.OrderRepository;
import com.food.foodorder.repository.PaymentRepository;
import com.food.foodorder.repository.UserRepository;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    // 1️⃣ INITIATE PAYMENT
    @Override
    @Transactional
    public Payment initiatePayment(Long orderId, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        // 🔐 User can pay only for his own order
        if (!order.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("Not allowed to pay for this order");
        }

        Payment payment = new Payment();
        payment.setOrderId(orderId); // ✅ Long
        payment.setAmount(order.getTotalAmount());
        payment.setPaymentMode("UPI");
        payment.setStatus(PaymentStatus.PENDING);
        payment.setCreatedAt(LocalDateTime.now());

        return paymentRepository.save(payment);
    }

    // 2️⃣ COMPLETE PAYMENT (MOCK)
    @Override
    @Transactional
    public Payment completePayment(Long orderId, String status) {

        Payment payment = paymentRepository
                .findTopByOrderIdOrderByIdDesc(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        if ("PAID".equalsIgnoreCase(status)) {

            // ✅ Update payment
            payment.setStatus(PaymentStatus.PAID);
            payment.setPaymentDate(LocalDateTime.now());

            // ✅ Update order
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

            order.setStatus(OrderStatus.PAID);
            orderRepository.save(order);

            // 🔥 AUTO CLEAR CART
            cartRepository.deleteByUserId(order.getUser().getId());

        } else {
            payment.setStatus(PaymentStatus.FAILED);
        }

        return paymentRepository.save(payment);
    }

    // 3️⃣ GET PAYMENT STATUS
    @Override
    @Transactional(readOnly = true)
    public Payment getPaymentStatus(Long orderId) {

        return paymentRepository
                .findTopByOrderIdOrderByIdDesc(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
    }
}

package com.food.foodorder.service;

import com.food.foodorder.entity.Payment;

public interface PaymentService {

    Payment initiatePayment(Long orderId, String email);

    Payment completePayment(Long orderId, String status);
    
    Payment getPaymentStatus(Long orderId);
}

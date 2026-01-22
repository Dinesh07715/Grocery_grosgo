package com.food.foodorder.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.food.foodorder.entity.Payment;
import com.food.foodorder.service.PaymentService;

@RestController
@RequestMapping("/payment")
@CrossOrigin("*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // USER → INITIATE PAYMENT
    @PostMapping("/initiate/{orderId}")
    public Payment initiatePayment(
            @PathVariable Long orderId,
            Authentication authentication) {

        String email = authentication.getName();
        return paymentService.initiatePayment(orderId, email);
    }

    // MOCK PAYMENT RESULT
    @PutMapping("/complete/{orderId}")
    public Payment completePayment(
            @PathVariable Long orderId,
            @RequestParam String status) {

        return paymentService.completePayment(orderId, status);
    }
    @GetMapping("/status/{orderId}")
    public Payment getPaymentStatus(@PathVariable Long orderId) {
        return paymentService.getPaymentStatus(orderId);
    }

}

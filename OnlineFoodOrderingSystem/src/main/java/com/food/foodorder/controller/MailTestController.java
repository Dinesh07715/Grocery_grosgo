package com.food.foodorder.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/mail")
public class MailTestController {

    @Autowired
    private JavaMailSender mailSender;

    @GetMapping("/test")
    public String testMail() {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("yourpersonalemail@gmail.com"); // 🔁 replace with your email
        message.setSubject("Test Mail from Grocery App");
        message.setText("If you received this email, your Spring Boot mail configuration is working!");

        mailSender.send(message);
        return "✅ Mail sent successfully! Check your inbox.";
    }
}

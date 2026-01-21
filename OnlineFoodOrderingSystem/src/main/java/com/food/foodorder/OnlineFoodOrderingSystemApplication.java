package com.food.foodorder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class OnlineFoodOrderingSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(OnlineFoodOrderingSystemApplication.class, args);
	}

}

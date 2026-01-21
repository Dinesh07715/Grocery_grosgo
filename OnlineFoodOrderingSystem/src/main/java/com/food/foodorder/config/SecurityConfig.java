package com.food.foodorder.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;


import com.food.foodorder.security.JwtAuthFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth

                // ✅ PUBLIC APIs
                .requestMatchers(
                    "/api/user/login",
                    "/api/user/register",
                    "/swagger-ui/**",
                    "/mail/test",
                    "/v3/api-docs/**",
                    "/uploads/**",
                    "/images/**",
                    "/api/foods",
                    "/api/foods/**",
                    "/api/products",
                    "/api/products/**"
                ).permitAll()

                // 🔒 CART (must be authenticated)
                .requestMatchers("/api/cart/**").hasAuthority("USER")

                // ✅ USER APIs
                .requestMatchers(
                    "/api/user/**", 
                    "/api/orders/place",
                    "/api/orders/my",
                    "/api/payment/initiate/**"
                ).hasAuthority("USER")


                .requestMatchers("/images/**").permitAll()


                // ✅ USER + ADMIN (order details - service checks ownership)
                .requestMatchers(
                    "/api/orders/*",
                    "/api/orders/*/items"
                ).hasAnyAuthority("USER", "ADMIN")

                // 🔥 FIXED: ADMIN APIs - Both formats work
                .requestMatchers(
                    "/api/orders",
                    "/api/orders/**",  // Covers /api/orders/58/status
                    "/api/orders/status/**",
                    "/api/payment/complete/**"
                ).hasAuthority( "ADMIN")  // ← CHANGED: Allow USER + ADMIN

                // ✅ EVERYTHING ELSE requires login
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}

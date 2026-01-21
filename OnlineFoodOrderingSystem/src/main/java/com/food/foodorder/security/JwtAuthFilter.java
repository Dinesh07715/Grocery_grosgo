package com.food.foodorder.security;

import java.io.IOException;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.food.foodorder.entity.User;
import com.food.foodorder.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;


@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();

        if (path.equals("/api/user/login")
        		 || path.equals("/api/user/register")
        		 || path.startsWith("/swagger-ui")
        		 || path.startsWith("/v3/api-docs")) {

        		    filterChain.doFilter(request, response);
        		    return;
        		}



        String header = request.getHeader("Authorization");
        System.out.println("AUTH HEADER = " + header);
        
        // Extract token from Authorization header
        String token = null;
        if (header != null && header.startsWith("Bearer ")) {
            token = header.substring(7);
        }

        // If no Authorization header, the token should be sent in request headers
        // The frontend already sends it in Authorization header, so this covers that case
        
        if (token != null) {

            if (jwtUtil.validateToken(token)
                    && SecurityContextHolder.getContext().getAuthentication() == null) {

                String email = jwtUtil.extractUsername(token);
                System.out.println("EMAIL FROM TOKEN = " + email);
                User user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("User not found"));

                // Spring Security roles should be ROLE_*; accept both stored formats.
                String role = user.getRole();
                if (role == null || role.isBlank()) {
                    throw new RuntimeException("User role is missing");
                }
                SimpleGrantedAuthority authority =
        new SimpleGrantedAuthority(role); // ADMIN or USER

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                user.getEmail(),
                                null,
                                List.of(authority)
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );


                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}


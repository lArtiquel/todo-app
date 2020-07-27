package com.todo.controller;

import com.todo.payload.request.LoginRequest;
import com.todo.payload.request.RegisterRequest;
import com.todo.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

/**
 * Class provides authentication methods.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${app.config.jwt.refresh.cookie}")
    private String refreshJwtCookieName;
    private AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        return authService.login(loginRequest, response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@CookieValue(name="RefreshToken") String refreshJwt, // Don't forget to change annotation name if u changed it in app.props
                                     HttpServletResponse response) {
        return authService.refresh(refreshJwt, response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        return authService.register(registerRequest);
    }

    @PostMapping("/logout")
    @PreAuthorize("hasAnyRole(\"USER\", \"ADMIN\")")
    public ResponseEntity<?> logout(
            @CookieValue(name="RefreshToken") String refreshJwt) { // Don't forget to change annotation name if u changed it in app.props
        return authService.logout(refreshJwt);
    }

}
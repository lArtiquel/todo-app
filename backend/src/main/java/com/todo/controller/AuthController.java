package com.todo.controller;

import com.todo.event.OnUserLoggedInEvent;
import com.todo.model.AccessToken;
import com.todo.model.RefreshToken;
import com.todo.payload.request.LoginRequest;
import com.todo.payload.request.RegisterRequest;
import com.todo.payload.response.LoginResponse;
import com.todo.payload.response.PlainMessageResponse;
import com.todo.payload.response.RefreshResponse;
import com.todo.security.UserDetailsImpl;
import com.todo.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.Set;

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
    private ApplicationEventPublisher applicationEventPublisher;

    @Autowired
    public AuthController(AuthService authService, ApplicationEventPublisher applicationEventPublisher) {
        this.authService = authService;
        this.applicationEventPublisher = applicationEventPublisher;
    }

    /**
     * Entry point for the user login process.
     * Operations:
     *  - Authenticate user.
     *  - Generate access and refresh tokens.
     *  - Add refresh token to the cookies.
     *  - Fetch user authorities.
     *  - Publish login event on success.
     */
    @Operation(summary = "Login user.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200", description = "User logged in successfully. Provided below is payload schema.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = LoginResponse.class)) }),
            @ApiResponse(
                    responseCode = "401", description = "Wrong credentials provided.",
                    content = @Content)})
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        // authenticate user
        final UserDetailsImpl userDetails = authService.authenticateUser(loginRequest);
        // issue new access and refresh tokens
        final AccessToken accessToken = authService.generateAccessToken(userDetails.getId());
        final RefreshToken refreshToken = authService.generateRefreshToken(userDetails.getId());
        // add cookie to the response
        authService.addCookieToTheResponse(response, authService.createRefreshTokenCookie(refreshToken));
        // get user authorities
        Set<String> setOfAuthorities = authService.getSetOfAuthorities(userDetails);
        // publish login event
        final OnUserLoggedInEvent userLoggedInEvent = new OnUserLoggedInEvent(userDetails);
        applicationEventPublisher.publishEvent(userLoggedInEvent);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new LoginResponse(accessToken.getToken(),
                                refreshToken.getToken(),
                                setOfAuthorities));
    }

    /**
     * Endpoint for refreshing access and refresh tokens.
     * Operations:
     * - Validate and fetch passed refresh token.
     * - Issue new access and update passed refresh token.
     * - Add updated refresh token to the cookies.
     */
    @Operation(summary = "Refresh tokens.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200", description = "Token refreshed successfully.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = RefreshResponse.class)) }),
            @ApiResponse(
                    responseCode = "401", description = "Invalid token.",
                    content = @Content)})
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@CookieValue(name="RefreshToken") String refreshJwt, // Don't forget to change annotation name if u changed it in app.props
                                     HttpServletResponse response) {
        // validate provided refresh token and fetch its model
        final RefreshToken oldRefreshToken = authService.validateRefreshTokenAndFetchItsModel(refreshJwt);
        // generate new tokens
        final AccessToken newAccessToken = authService.generateAccessToken(oldRefreshToken.getUserId());
        final RefreshToken updatedRefreshToken = authService.updateRefreshToken(oldRefreshToken);
        // add refresh token cookie
        authService.addCookieToTheResponse(response, authService.createRefreshTokenCookie(updatedRefreshToken));

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new RefreshResponse(newAccessToken.getToken(),
                                updatedRefreshToken.getToken()));
    }

    /**
     * Endpoint for new user registering.
     */
    @Operation(summary = "Register user.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200", description = "User registered successfully.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PlainMessageResponse.class)) }),
            @ApiResponse(
                    responseCode = "409", description = "User with such username already exists.",
                    content = @Content),
            @ApiResponse(
                    responseCode = "500", description = "No such role on server.",
                    content = @Content)})
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        authService.register(registerRequest);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new PlainMessageResponse("User registered successfully!"));
    }

    /**
     * Endpoint to logout user.
     * Operations:
     * - Validate refresh token.
     * - Withdraw refresh token.
     */
    @Operation(summary = "Logout user.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200", description = "User logged out successfully.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PlainMessageResponse.class)) }),
            @ApiResponse(
                    responseCode = "401", description = "Refresh token failed validation.",
                    content = @Content)})
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @CookieValue(name="RefreshToken") String refreshJwt) { // Don't forget to change annotation name if u changed it in app.props
        // validate refresh token
        final RefreshToken refreshToken = authService.validateRefreshTokenAndFetchItsModel(refreshJwt);
        // withdraw refresh token
        authService.withdrawRefreshToken(refreshToken);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new PlainMessageResponse("User logged out successfully!"));
    }

}
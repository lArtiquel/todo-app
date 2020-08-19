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
@RestController
@RequestMapping("/api/auth")
public class AuthController {

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
                    responseCode = "200", description = "User logged in successfully.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = LoginResponse.class))}),
            @ApiResponse(
                    responseCode = "401", description = "Wrong credentials provided.",
                    content = @Content)})
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        // authenticate user
        final UserDetailsImpl userDetails = authService.authenticateUser(loginRequest);
        // issue new access and refresh tokens
        final AccessToken accessToken = authService.generateAccessToken(userDetails.getId());
        final RefreshToken refreshToken = authService.generateRefreshToken(userDetails.getId());
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
    @PostMapping(value="/refresh", params = "token")
    public ResponseEntity<?> refresh(@RequestParam String token) {
        // validate provided refresh token and fetch its model
        RefreshToken refreshTokenModel = authService.validateRefreshTokenAndFetchItsModel(token);
        // generate new access token and update refresh token
        AccessToken accessTokenModel = authService.generateAccessToken(refreshTokenModel.getUserId());
        refreshTokenModel = authService.updateRefreshToken(refreshTokenModel);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new RefreshResponse(accessTokenModel.getToken(),
                        refreshTokenModel.getToken()));
    }

    /**
     * Endpoint for new user registering.
     */
    @Operation(summary = "Register user.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200", description = "Registered successfully.",
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
                .body(new PlainMessageResponse("Registered successfully! Now try to login."));
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
                    responseCode = "200", description = "Logged out successfully.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PlainMessageResponse.class)) }),
            @ApiResponse(
                    responseCode = "401", description = "Refresh token failed validation.",
                    content = @Content)})
    @PostMapping(value = "/logout", params = "token")
    public ResponseEntity<?> logout(@RequestParam String token) {
        // validate refresh token
        final RefreshToken refreshToken = authService.validateRefreshTokenAndFetchItsModel(token);
        // withdraw refresh token
        authService.withdrawRefreshToken(refreshToken);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new PlainMessageResponse("Logged out successfully!"));
    }

}
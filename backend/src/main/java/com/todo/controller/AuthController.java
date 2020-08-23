package com.todo.controller;

import com.todo.event.OnUserLoggedInEvent;
import com.todo.model.AccessToken;
import com.todo.model.RefreshToken;
import com.todo.payload.request.LoginRequest;
import com.todo.payload.request.RegisterRequest;
import com.todo.payload.response.LoginResponse;
import com.todo.payload.response.PlainMessageResponse;
import com.todo.payload.response.RefreshResponse;
import com.todo.security.jwt.JwtAuthenticityTokenImpl;
import com.todo.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Collection;

/**
 * Class provides authentication endpoints.
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

    @Operation(summary = "Login user.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200", description = "User logged in successfully.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = LoginResponse.class))}),
            @ApiResponse(
                    responseCode = "401", description = "User not found/wrong credentials provided/account unverified.",
                    content = @Content)})
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        // authenticate user with provided credentials and get jwt authorization token
        JwtAuthenticityTokenImpl authenticityToken = authService.authenticateUser(loginRequest);
        // issue new access and refresh tokens
        AccessToken accessToken = authService.generateAccessToken(authenticityToken.getPrincipal(),
                authenticityToken.getAuthorities());
        RefreshToken refreshToken = authService.generateRefreshToken(authenticityToken.getPrincipal());
        // publish login event
        authService.publishLoginEvent(authenticityToken.getPrincipal());

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new LoginResponse(accessToken.getToken(),
                                refreshToken.getToken(),
                                authenticityToken.getSetOfStringAuthorities()));
    }

    @Operation(summary = "Verify email.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200", description = "Email verified.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PlainMessageResponse.class)) }),
            @ApiResponse(
                    responseCode = "404", description = "User with such email is not found.",
                    content = @Content),
            @ApiResponse(
                    responseCode = "409", description = "Wrong email verification token!",
                    content = @Content)})
    @GetMapping(value = "/verify", params = "token")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new PlainMessageResponse("Email successfully verified! Now try to login."));
    }

    @Operation(summary = "Cancel email verification and user account.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200", description = "Account with that email canceled.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PlainMessageResponse.class)) }),
            @ApiResponse(
                    responseCode = "404", description = "User with such email is not found.",
                    content = @Content),
            @ApiResponse(
                    responseCode = "409", description = "Wrong email verification token.",
                    content = @Content)})
    @GetMapping(value = "/cancel-verify", params = "token")
    public ResponseEntity<?> cancelAccount(@RequestParam String token) {
        authService.cancelAccount(token);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new PlainMessageResponse("Account with that email successfully canceled! Thank you."));
    }

    @Operation(summary = "Reset password for provided email.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200", description = "Reset password mail send to provided email.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PlainMessageResponse.class)) }),
            @ApiResponse(
                    responseCode = "404", description = "User with such email is not found.",
                    content = @Content)})
    @PostMapping(value = "/reset-password-for-email", params = "email")
    public ResponseEntity<?> resetPasswordForEmail(@RequestParam String email) {
        authService.resetPasswordForEmail(email);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new PlainMessageResponse("Reset password mail send to provided email. Check mailbox!"));
    }

    @Operation(summary = "Reset password.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200", description = "Password reset success",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PlainMessageResponse.class)) }),
            @ApiResponse(
                    responseCode = "404", description = "User with such email is not found.",
                    content = @Content),
            @ApiResponse(
                    responseCode = "409", description = "New token for password restoring issued.",
                    content = @Content),
            @ApiResponse(
                    responseCode = "409", description = "Wrong or expired token for password restoring.",
                    content = @Content)})
    @PostMapping(value = "/reset-password", params = {"token", "newPassword"})
    public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        authService.resetPassword(token, newPassword);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new PlainMessageResponse("Password successfully changed! Now try to login."));
    }

    @Operation(summary = "Cancel reset password operation.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200", description = "Password reset operation successfully canceled.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PlainMessageResponse.class)) }),
            @ApiResponse(
                    responseCode = "404", description = "User with such email is not found.",
                    content = @Content),
            @ApiResponse(
                    responseCode = "409", description = "Wrong or expired token for password restoring.",
                    content = @Content)})
    @GetMapping(value = "/cancel-reset-password", params = "token")
    public ResponseEntity<?> cancelResetPassword(@RequestParam String token) {
        authService.cancelResetPassword(token);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new PlainMessageResponse("Password reset token successfully canceled!"));
    }

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
        // fetch user from db for granted authorities
        Collection<GrantedAuthority> authorities = authService.getUserAuthoritiesByUserId(refreshTokenModel.getUserId());
        // generate new access token and update refresh token
        AccessToken accessTokenModel = authService.generateAccessToken(refreshTokenModel.getUserId(),
                                                                            authorities);
        refreshTokenModel = authService.updateRefreshToken(refreshTokenModel);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new RefreshResponse(accessTokenModel.getToken(),
                        refreshTokenModel.getToken(),
                        authorities));
    }

    @Operation(summary = "Register user.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200", description = "Registered successfully.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PlainMessageResponse.class)) }),
            @ApiResponse(
                    responseCode = "409", description = "User with such email already exists/.",
                    content = @Content),
            @ApiResponse(
                    responseCode = "500", description = "No such role on server.",
                    content = @Content)})
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        authService.preRegisterCheck(registerRequest);
        authService.register(registerRequest);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new PlainMessageResponse("Registered successfully! Now try to login."));
    }

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
        RefreshToken refreshToken = authService.validateRefreshTokenAndFetchItsModel(token);
        // withdraw refresh token
        authService.withdrawRefreshToken(refreshToken);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new PlainMessageResponse("Logged out successfully!"));
    }

}
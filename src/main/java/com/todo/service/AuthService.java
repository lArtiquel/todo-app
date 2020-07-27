package com.todo.service;

import com.todo.exception.BadRoleException;
import com.todo.model.*;
import com.todo.payload.request.LoginRequest;
import com.todo.payload.request.RegisterRequest;
import com.todo.payload.response.ApiResponse;
import com.todo.payload.response.LoginResponse;
import com.todo.payload.response.RefreshResponse;
import com.todo.repository.RefreshTokenRepository;
import com.todo.repository.RoleRepository;
import com.todo.repository.UserRepository;
import com.todo.security.JwtProvider;
import com.todo.security.JwtValidator;
import com.todo.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Value("${app.config.jwt.refresh.cookie}")
    private String refreshJwtCookieName;

    private AuthenticationManager authenticationManager;
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private RefreshTokenRepository refreshTokenRepository;
    private PasswordEncoder passwordEncoder;
    private JwtProvider jwtProvider;
    private JwtValidator jwtValidator;

    @Autowired
    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository, RoleRepository roleRepository, RefreshTokenRepository refreshTokenRepository, PasswordEncoder passwordEncoder, JwtProvider jwtProvider, JwtValidator jwtValidator) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtProvider = jwtProvider;
        this.jwtValidator = jwtValidator;
    }

    public ResponseEntity<?> login(LoginRequest loginRequest, HttpServletResponse response) {

        // authenticate user with provided username and password
        final Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        // set authentication object in Security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // get user details of authenticated user
        final UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // generate access and refresh jwt tokens
        final AccessToken accessToken = jwtProvider.generateAccessJwt(userDetails.getId());
        final String refreshTokenStr = jwtProvider.generateRefreshJwt(userDetails.getId());

        // create new cookie from refresh token
        final Cookie refreshCookie = createCookie(refreshJwtCookieName, refreshTokenStr,
                jwtProvider.getRefreshJwtMaxAgeInSec(),
                true, true,
                "/api/auth" // send this cookie only for /api/auth endpoint
        );

        // add refresh token cookie to response
        response.addCookie(refreshCookie);

        // convert set of user's granted authorities to set the set of strings
        final Set<String> authorities = userDetails.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ApiResponse<>(false,
                        "Authentication success!",
                        new LoginResponse(accessToken.getToken(),
                                accessToken.getExpiredInSeconds(),
                                refreshTokenStr,
                                authorities)));
    }

    public ResponseEntity<?> refresh(String refreshJwt, HttpServletResponse response) {
        // validate refresh jwt
        if(jwtValidator.validateRefreshJwt(refreshJwt)){
            // fetch token id from jwt
            final String refreshTokenModelId = jwtProvider.getTokenIdFromRefreshJwt(refreshJwt);

            // fetch refresh token from database
            final Optional<RefreshToken> refreshTokenModel = refreshTokenRepository.findById(refreshTokenModelId);

            if(refreshTokenModel.isPresent()) {

                // generate new access and refresh jwt tokens
                final AccessToken newAccessToken = jwtProvider.generateAccessJwt(refreshTokenModel.get().getUserId());
                final String newRefreshTokenStr = jwtProvider.generateRefreshJwt(refreshTokenModel.get().getUserId());

                // replace old token with new in db
                refreshTokenRepository.deleteById(refreshTokenModelId);

                // create new cookie from refresh token
                final Cookie refreshCookie = createCookie(refreshJwtCookieName, newRefreshTokenStr,
                        jwtProvider.getRefreshJwtMaxAgeInSec(),
                        true, true,
                        "/api/auth" // send this cookie only for /api/auth endpoint
                );

                // add refresh token cookie to response
                response.addCookie(refreshCookie);

                return ResponseEntity
                        .status(HttpStatus.OK)
                        .body(new ApiResponse<>(false,
                                "Token refreshing success!",
                                new RefreshResponse(newAccessToken.getToken(),
                                        newAccessToken.getExpiredInSeconds(),
                                        newRefreshTokenStr)));
            } else {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse<>(true,
                                "Wrong refresh token!"));
            }
        } else {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(true,
                            "Invalid refresh jwt!"));
        }
    }

    public ResponseEntity<?> register(RegisterRequest registerRequest) {

        // verify whether user with such username already exists
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(new ApiResponse(true,
                            "User with such username already exists!"));
        }

        // get user Role from database
        final Role role = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new BadRoleException("Error: No such role!"));

        // create new user's account
        final User user = new User(registerRequest.getUsername(),
                passwordEncoder.encode(registerRequest.getPassword()),
                Set.of(role));

        // save new user in db
        userRepository.save(user);

        // return success status
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ApiResponse(false,
                        "Registration success!"));
    }

    public ResponseEntity<?> logout(String refreshJwt) {
        // validate refresh jwt
        if(jwtValidator.validateRefreshJwt(refreshJwt)) {
            // get refresh token model id
            final String refreshTokenModelId = jwtProvider.getTokenIdFromRefreshJwt(refreshJwt);

            final Optional<RefreshToken> refreshTokenModel = refreshTokenRepository.findById(refreshTokenModelId);

            if(refreshTokenModel.isPresent()){
                // remove refresh token from database
                refreshTokenRepository.deleteById(refreshTokenModelId);

                return ResponseEntity
                        .status(HttpStatus.OK)
                        .body(new ApiResponse<>(false,
                                "Logout success!"));

            } else {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse<>(true,
                                "Wrong refresh token!"));
            }
        } else {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(true,
                            "Invalid refresh token!"));
        }
    }

    private Cookie createCookie(String name, String value,
                                       int maxAge, boolean secure, boolean httpOnly, String path) {
        // create a cookie
        final Cookie cookie = new Cookie(name, value);

        // set expiration time, secure, httpOnly and path attributes
        cookie.setMaxAge(maxAge);
        cookie.setSecure(false); // TODO: Change back to secure(needed to test thru postman, localhost is not https)
        cookie.setHttpOnly(httpOnly);
        cookie.setPath(path);

        return cookie;
    }

}

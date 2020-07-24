package com.todo.controllers;

import com.todo.exception.BadRoleException;
import com.todo.models.ERole;
import com.todo.models.Role;
import com.todo.models.User;
import com.todo.payload.request.LoginRequest;
import com.todo.payload.request.RegisterRequest;
import com.todo.payload.response.ApiResponse;
import com.todo.payload.response.JwtResponse;
import com.todo.payload.response.MessageResponse;
import com.todo.repository.RoleRepository;
import com.todo.repository.UserRepository;
import com.todo.security.JwtProvider;
import com.todo.security.JwtValidator;
import com.todo.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Class provides authentication methods.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private AuthenticationManager authenticationManager;
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder encoder;
    private JwtProvider jwtProvider;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder encoder, JwtProvider jwtProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.encoder = encoder;
        this.jwtProvider = jwtProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {

        // authenticate user with provided username and password
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        // push authentication object to the Security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // generate jwt access token
        final String accessToken = jwtProvider.generateJwt(authentication);

        // get user details from authentication
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // convert set of granted authorities to set the set of strings
        Set<String> authorities = userDetails.getAuthorities()
                                .stream()
                                .map(GrantedAuthority::getAuthority)
                                .collect(Collectors.toSet());

        // send OK status, message, and token with set of authorities
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ApiResponse<>(false,
                        "User successfully logged in!",
                        new JwtResponse(accessToken, authorities)));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {

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
        User user = new User(registerRequest.getUsername(),
                encoder.encode(registerRequest.getPassword()),
                        Set.of(role));

        // save new user in db
        userRepository.save(user);

        // return success status
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ApiResponse(false,
                        "User successfully registered!"));
    }

}
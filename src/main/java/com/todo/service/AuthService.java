package com.todo.service;

import com.todo.model.*;
import com.todo.payload.request.LoginRequest;
import com.todo.payload.request.RegisterRequest;
import com.todo.repository.RefreshTokenRepository;
import com.todo.repository.RoleRepository;
import com.todo.repository.UserRepository;
import com.todo.security.JwtProvider;
import com.todo.security.JwtValidator;
import com.todo.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/** Authentication service. */
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

    /**
     * Authenticates user with provided credentials
     * @param loginRequest login credentials from request
     * @return user details
     * @throws ResponseStatusException if user provided wrong credentials.
     */
    public UserDetailsImpl authenticateUser(LoginRequest loginRequest) throws ResponseStatusException {
        try {
            // authenticate user with provided credentials
            final Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),
                            loginRequest.getPassword()));

            // set authentication in security context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // fetch user details
            return (UserDetailsImpl) authentication.getPrincipal();
        } catch (AuthenticationException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Wrong credentials provided!", e);
        }
    }

    /** Generates access token. */
    public AccessToken generateAccessToken(String userId) {
        return jwtProvider.generateAccessJwt(userId);
    }

    /** Generates refresh token. */
    public RefreshToken generateRefreshToken(String userId) {
        return jwtProvider.generateRefreshJwt(userId);
    }

    /** Creates refresh token cookie. */
    public Cookie createRefreshTokenCookie(RefreshToken refreshToken) {
        // create a cookie
        final Cookie cookie = new Cookie(refreshJwtCookieName, refreshToken.getToken());

        // set expiration time, secure, httpOnly and path attributes
        cookie.setMaxAge(jwtProvider.getRefreshJwtMaxAgeInSec());
        cookie.setSecure(false); // TODO: Change back to secure in production (localhost is not https)
        cookie.setHttpOnly(true);
        cookie.setPath("/api/auth");

        return cookie;
    }

    /** Creates cookie in response .*/
    public void addCookieToTheResponse(HttpServletResponse response, Cookie cookie) {
        response.addCookie(cookie);
    }

    /** Returns set of user's granted authorities. */
    public Set<String> getSetOfAuthorities(UserDetails userDetails) {
        return userDetails.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());
    }

    /**
     * Validates token and fetches it from db.
     * @return Fetched refresh token model stored in db
     * @throws ResponseStatusException
     */
    public RefreshToken validateRefreshTokenAndFetchItsModel(String refreshJwt) throws ResponseStatusException {
        // check jwt token on validity
        if(!jwtValidator.validateRefreshJwt(refreshJwt))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token validation not passed!");

        // check if there is such token in database
        final String refreshTokenModelId = jwtProvider.getTokenIdFromRefreshJwt(refreshJwt);
        final Optional<RefreshToken> refreshToken = refreshTokenRepository.findById(refreshTokenModelId);
        if(refreshToken.isPresent())
            return refreshToken.get();
        else
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Non-existent refresh token provided!");
    }

    /** Updates refresh token */
    public RefreshToken updateRefreshToken(RefreshToken refreshToken) {
        return jwtProvider.updateRefreshToken(refreshToken);
    }

    /** Register new user service. */
    public void register(RegisterRequest registerRequest) throws ResponseStatusException {
        // check if user with such username already exists in db
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User with such username already exists!");
        }

        // get user Role from db
        final Role role = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "No such role!"));

        // create new user's account
        final User user = new User(registerRequest.getUsername(),
                passwordEncoder.encode(registerRequest.getPassword()),
                Set.of(role));

        // save new user in db
        userRepository.save(user);
    }

    /** Delete refresh token from db. */
    public void withdrawRefreshToken(RefreshToken refreshToken) {
        refreshTokenRepository.deleteById(refreshToken.getId());
    }

}

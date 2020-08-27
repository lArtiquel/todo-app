package com.todo.service;

import com.todo.event.OnEmailVerificationRequiredEvent;
import com.todo.event.OnPasswordResetTokenSendEvent;
import com.todo.event.OnUserLoggedInEvent;
import com.todo.model.*;
import com.todo.payload.request.LoginRequest;
import com.todo.payload.request.RegisterRequest;
import com.todo.repository.RefreshTokenRepository;
import com.todo.repository.RoleRepository;
import com.todo.repository.UserRepository;
import com.todo.security.EmailPasswordAuthenticationTokenImpl;
import com.todo.security.UserDetailsImpl;
import com.todo.security.jwt.JwtAuthenticityTokenImpl;
import com.todo.security.jwt.JwtParser;
import com.todo.security.jwt.JwtProvider;
import com.todo.security.jwt.JwtValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collection;
import java.util.Optional;
import java.util.Set;

/** Authentication service. */
@Service
@Transactional
public class AuthService {

    private AuthenticationManager authenticationManager;
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private RefreshTokenRepository refreshTokenRepository;
    private PasswordEncoder passwordEncoder;
    private JwtProvider jwtProvider;
    private JwtValidator jwtValidator;
    private JwtParser jwtParser;
    private ApplicationEventPublisher applicationEventPublisher;

    @Autowired
    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository, RoleRepository roleRepository,
                       RefreshTokenRepository refreshTokenRepository, PasswordEncoder passwordEncoder, JwtProvider jwtProvider,
                       JwtValidator jwtValidator, JwtParser jwtParser, ApplicationEventPublisher applicationEventPublisher) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtProvider = jwtProvider;
        this.jwtValidator = jwtValidator;
        this.jwtParser = jwtParser;
        this.applicationEventPublisher = applicationEventPublisher;
    }

    /**
     * Authenticate user with provided credentials.
     * @param loginRequest login credentials from request.
     * @return user details
     * @throws ResponseStatusException if user provided wrong credentials.
     */
    public JwtAuthenticityTokenImpl authenticateUser(LoginRequest loginRequest) throws ResponseStatusException {
        try {
            // authenticate user with provided credentials
            final Authentication authenticityToken = authenticationManager.authenticate(
                    new EmailPasswordAuthenticationTokenImpl(loginRequest.getEmail(),
                                                    loginRequest.getPassword()));
            // set authentication in security context
            SecurityContextHolder.getContext().setAuthentication(authenticityToken);
            // return jwt authorization token
            return (JwtAuthenticityTokenImpl) authenticityToken;
        } catch (DisabledException e) {
            // resend email verification message to the mailbox
            applicationEventPublisher.publishEvent(new OnEmailVerificationRequiredEvent(loginRequest.getEmail(),
                    userRepository.findByEmail(loginRequest.getEmail()).get().getEmailVerificationToken()));
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        } catch (AuthenticationException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        }
    }

    /** Generate access token. */
    public AccessToken generateAccessToken(String userId, Collection<GrantedAuthority> grantedAuthorities) {
        return jwtProvider.generateAccessJwt(userId, grantedAuthorities);
    }

    /** Generate refresh token. */
    public RefreshToken generateRefreshToken(String userId) {
        return jwtProvider.generateRefreshJwt(userId);
    }

    /** Publish user logged in event. */
    public void publishLoginEvent(String userId) {
        applicationEventPublisher.publishEvent(new OnUserLoggedInEvent(userId));
    }

    /**
     * Validate token and fetch it from db.
     * @return Fetched refresh token model from db.
     * @throws ResponseStatusException
     */
    public RefreshToken validateRefreshTokenAndFetchItsModel(String refreshJwt) throws ResponseStatusException {
        // check jwt token on validity
        if(!jwtValidator.validateRefreshJwt(refreshJwt))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token validation not passed!");

        // check if there is such token in database
        final String refreshTokenModelId = jwtParser.getTokenIdFromRefreshJwt(refreshJwt);
        final Optional<RefreshToken> refreshToken = refreshTokenRepository.findById(refreshTokenModelId);
        if(refreshToken.isPresent())
            return refreshToken.get();
        else
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Non-existent refresh token provided!");
    }

    /** Update refresh token. */
    public RefreshToken updateRefreshToken(RefreshToken refreshToken) {
        return jwtProvider.updateRefreshToken(refreshToken);
    }

    /** Pre-register checks */
    public void preRegisterCheck(RegisterRequest registerRequest) {
        Optional<User> user = userRepository.findByEmail(registerRequest.getEmail());
        if(user.isPresent()) {
            if(user.get().getEmailVerificationToken() != null) {
                // resend email verification code
                OnEmailVerificationRequiredEvent event = new OnEmailVerificationRequiredEvent(registerRequest.getEmail(),
                                                                                    user.get().getEmailVerificationToken());
                applicationEventPublisher.publishEvent(event);
                throw new ResponseStatusException(HttpStatus.CONFLICT, "User with such email already exists, but email is not verified. Check mailbox to verify account and then login.");
            } else {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "User with such email already exists.!");
            }
        }
    }

    /** Register new user service. */
    public void register(RegisterRequest registerRequest) throws ResponseStatusException {
        // get user Role from db
        final Role role = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "No such role!"));

        // create new user's account
        final User user = new User(registerRequest.getEmail(),
                passwordEncoder.encode(registerRequest.getPassword()),
                Set.of(role),
                jwtProvider.generateEmailVerificationToken(registerRequest.getEmail()));

        // save new user in db
        userRepository.save(user);

        // publish email verification required event
        OnEmailVerificationRequiredEvent event = new OnEmailVerificationRequiredEvent(registerRequest.getEmail(),
                                                                                user.getEmailVerificationToken());
        applicationEventPublisher.publishEvent(event);
    }

    /** Delete refresh token from db. */
    public void withdrawRefreshToken(RefreshToken refreshToken) {
        refreshTokenRepository.deleteById(refreshToken.getId());
    }

    /** Get user authorities by user id. */
    public Collection<GrantedAuthority> getUserAuthoritiesByUserId(String id) throws ResponseStatusException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                                    "User with such id is not found!"));
        UserDetailsImpl userDetails = UserDetailsImpl.build(user);
        return userDetails.getAuthorities();
    }

    /** Verify email with provided token. */
    public void verifyEmail(String token) throws ResponseStatusException {
        if(jwtValidator.validateEmailVerificationJwt(token)) {
            // get user by email from token
            User user = userRepository.findByEmail(jwtParser.getEmailFromEmailVerificationJwt(token))
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User with such email is not found."));
            // remove email verification token
            user.setEmailVerificationToken(null);
            // update user
            userRepository.save(user);
        } else {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Wrong email verification token!");
        }
    }

    /** Cancel account with that email in token. */
    public void cancelAccount(String token) throws ResponseStatusException {
        if(jwtValidator.validateEmailVerificationJwt(token)) {
            // get user by email from token
            User user = userRepository.findByEmail(jwtParser.getEmailFromEmailVerificationJwt(token))
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User with such email is not found."));
            // delete user
            userRepository.delete(user);
        } else {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Wrong email verification token!");
        }
    }

    /** Check user with such email and send email with reset password email. */
    public void resetPasswordForEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User with such email is not found."));
        // generate reset password token and save in user repo
        String token = jwtProvider.generateResetPasswordToken(email);
        user.setPasswordResetToken(token);
        userRepository.save(user);
        // publish event which sends reset token to the provided email
        applicationEventPublisher.publishEvent(new OnPasswordResetTokenSendEvent(email, token));
    }

    /** Reset password for user with that email in token. */
    public void resetPassword(String token, String newPassword) throws ResponseStatusException {
        if(jwtValidator.validateResetPasswordJwt(token)) {
            // get user by email from token
            User user = userRepository.findByEmail(jwtParser.getEmailFromResetPasswordJwt(token))
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User with such email is not found."));
            if(user.getPasswordResetToken().equals(token)) {
                // set new password and remove reset token
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setPasswordResetToken(null);
                // update user in db
                userRepository.save(user);
            } else {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "New password reset token issued. Check the mailbox!");
            }
        } else {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Wrong or expired token for password restoring!");
        }
    }

    /** Cancel reset token. */
    public void cancelPasswordReset(String token) throws ResponseStatusException {
        if(jwtValidator.validateResetPasswordJwt(token)) {
            // get user by email from token
            User user = userRepository.findByEmail(jwtParser.getEmailFromResetPasswordJwt(token))
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User with such email is not found."));
            if(user.getPasswordResetToken().equals(token)){
                // remove password reset token
                user.setPasswordResetToken(null);
                // update user in db
                userRepository.save(user);
            } else {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "New password reset token issued. Check the mailbox!");
            }
        } else {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Wrong or expired token for password restoring!");
        }
    }

}

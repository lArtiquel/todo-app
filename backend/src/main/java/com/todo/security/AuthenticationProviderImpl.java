package com.todo.security;

import com.todo.security.jwt.JwtAuthenticityTokenImpl;
import com.todo.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;

public class AuthenticationProviderImpl implements AuthenticationProvider {

    private UserDetailsServiceImpl userDetailsService;
    private PasswordEncoder passwordEncoder;

    @Autowired
    public AuthenticationManagerImpl(UserDetailsServiceImpl userDetailsService, PasswordEncoder passwordEncoder) {
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Method inherited from {@code AuthenticationManager} and used for user authentication.
     * @param authentication authentication token with email and password fields. Note, this is not an authentication token.
     * @return Jwt token with user's id set as principle and user's granted authorities. This is an authentication token i.e. can be set is Security Context.
     * @throws AuthenticationException
     */
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        final String email = (String)authentication.getPrincipal();
        final String password = (String)authentication.getCredentials();

        final UserDetailsImpl userDetails = userDetailsService.loadUserByEmail(email);

        if(!userDetails.isEnabled()) throw new DisabledException("Verify email first! Check the mail box.");

        if(!userDetails.getPassword().equals(passwordEncoder.encode(password))) throw new BadCredentialsException("Wrong credentials provided!");

        return new JwtAuthenticityTokenImpl(userDetails.getId(), userDetails.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return aClass.equals(JwtAuthenticityTokenImpl.class);
    }
}

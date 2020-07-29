package com.todo.security;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.todo.service.AuthService;
import com.todo.service.UserDetailsServiceImpl;
import io.jsonwebtoken.ExpiredJwtException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Filter is intended to be used before Security to fetch and parse JWT token.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthFilter.class);

    @Value("${app.config.jwt.access.header}")
    private String accessJwtHeaderName;

    private JwtValidator jwtValidator;
    private JwtProvider jwtProvider;
    private UserDetailsServiceImpl userDetailsService;
    private JwtParser jwtParser;

    @Autowired
    public JwtAuthFilter(JwtValidator jwtValidator, JwtProvider jwtProvider, UserDetailsServiceImpl userDetailsService, JwtParser jwtParser) {
        this.jwtValidator = jwtValidator;
        this.jwtProvider = jwtProvider;
        this.userDetailsService = userDetailsService;
        this.jwtParser = jwtParser;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
            // get jwt access token from req header
            final String jwt = jwtParser.getJwtFromHeader(request, accessJwtHeaderName);

            // validate jwt access token
            if (jwt != null && jwtValidator.validateAccessJwt(jwt)) {
                // get userId from jwt token
                final String id = jwtProvider.getUserIdFromAccessJwt(jwt);
                // get user details
                final UserDetails userDetails = userDetailsService.loadUserById(id);
                try {
                    // create authentication token
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails,
                                                                                                                null,
                                                                                                                userDetails.getAuthorities());
                    // set authentication details
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    // set user's authentication in Security context
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } catch (Exception e) {
                    // in case of failure make sure it's clear; so guarantee user won't be authenticated
                    SecurityContextHolder.clearContext();
                    logger.error("Cannot set user authentication: {}", e.getMessage());
                }
            }


        filterChain.doFilter(request, response);
    }

}

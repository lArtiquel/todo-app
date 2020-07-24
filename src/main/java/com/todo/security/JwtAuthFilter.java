package com.todo.security;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.todo.services.UserDetailsServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Filter is intended to be used before Security to fetch and parse JWT token.
 */
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtValidator jwtTokenValidator;

    @Autowired
    private JwtProvider jwtTokenProvider;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // get jwt token from req header
            String jwt = parseJwt(request);

            // validate jwt token
            if (jwt != null && jwtTokenValidator.validateJwtToken(jwt)) {
                // get userId from jwt token
                final String id = jwtTokenProvider.getUserIdFromJwt(jwt);
                // get user details
                final UserDetails userDetails = userDetailsService.loadUserById(id);
                // create authentication token
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails,
                                                                                                            null,
                                                                                                            userDetails.getAuthorities());
                // set authentication details
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                // set user's authentication in Security context
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring("Bearer ".length());
        }

        return null;
    }

}

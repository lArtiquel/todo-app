package com.todo.security.jwt;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

/**
 * Filter is intended to be used before Security to fetch and parse JWT access token.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Value("${app.config.permitAllRoutes}")
    private List<String> permitAllRoutes;

    private JwtValidator jwtValidator;
    private JwtParser jwtParser;

    @Autowired
    public JwtAuthenticationFilter(JwtValidator jwtValidator, JwtParser jwtParser) {
        this.jwtValidator = jwtValidator;
        this.jwtParser = jwtParser;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // this action needed not to filter requests with `permitAllRoutes` URI only
        // it won't cause any issue if u delete it cause this routes are already configured as `permitAll` in Security
        return permitAllRoutes.contains(request.getRequestURI());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        // get jwt access token from req header
        final String jwt = jwtParser.getAccessJwtFromHeader(request);

        // validate jwt access token
        if (jwt != null && jwtValidator.validateAccessJwt(jwt)) {
            try {
                // create authentication token
                Authentication authenticationToken = new JwtAuthenticityTokenImpl(jwtParser.getUserIdFromAccessJwt(jwt),
                                                                jwtParser.getUsersGrantedAuthoritiesFromAccessJwt(jwt));
                // set user's authentication token in Security context
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            } catch (AuthenticationException e) {
                logger.error("Authentication exception: {}", e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }

}

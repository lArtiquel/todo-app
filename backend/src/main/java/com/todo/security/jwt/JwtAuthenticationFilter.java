package com.todo.security.jwt;

import com.todo.security.EmailPasswordAuthTokenImpl;
import com.todo.service.UserDetailsServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
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
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthFilter.class);

    @Value("${app.config.jwt.access.header}")
    private String accessJwtHeaderName;

    @Value("${app.config.permitAllRoutes}")
    private List<String> permitAllRoutes;

    private JwtValidator jwtValidator;
    private JwtProvider jwtProvider;
    private JwtParser jwtParser;

    @Autowired
    public JwtAuthFilter(JwtValidator jwtValidator, JwtProvider jwtProvider, JwtParser jwtParser) {
        this.jwtValidator = jwtValidator;
        this.jwtProvider = jwtProvider;
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
        final String jwt = jwtParser.getJwtFromHeader(request, accessJwtHeaderName);

        // validate jwt access token
        if (jwt != null && jwtValidator.validateAccessJwt(jwt)) {
            try {
                // create authentication token
                Authentication authenticationToken = new JwtAuthTokenImpl(jwtProvider.getUserIdFromAccessJwt(jwt),
                        jwtProvider.getUsersGrantedAuthoritiesFromAccessJwt(jwt));
                // set user's authentication token in Security context
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            } catch (AuthenticationException e) {
                logger.error("Authentication exception: {}", e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }

}

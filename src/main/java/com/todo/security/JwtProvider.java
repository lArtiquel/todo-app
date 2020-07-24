package com.todo.security;

import com.todo.services.UserDetailsImpl;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Date;

@Component
public class JwtProvider {

    @Value("${app.config.jwtSecret}")
    private String jwtSecret;

    @Value("${app.config.jwtExpirationMs}")
    private long jwtExpirationMs;

//    @Value("${app.config.jwtRefreshSecret}")
//    private String jwtRefreshSecret;
//
//    @Value("${app.config.jwtRefreshExpirationMs}")
//    private long jwtRefreshExpirationMs;

    /**
     * Generates access token from a principal object.
     */
    public String generateJwt(Authentication authentication) {
        Instant expiryDate = Instant.now().plusMillis(jwtExpirationMs);
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject((userPrincipal.getId()))
                .setIssuedAt(new Date())
                .setExpiration(Date.from(expiryDate))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    /**
     * Returns the user id encapsulated within the token.
     */
    public String getUserIdFromJwt(String token) {
        Claims claims = Jwts.parser().
                setSigningKey(jwtSecret).
                parseClaimsJws(token).
                getBody();

        return claims.getSubject();
    }

    /**
     * Return the jwt expiration for the client so that they can execute
     * the refresh token logic appropriately
     */
    public long getExpiryDuration() {
        return jwtExpirationMs;
    }

}

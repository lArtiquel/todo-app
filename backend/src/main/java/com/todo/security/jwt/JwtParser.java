package com.todo.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.util.Collection;

/** Used to fetch jwt tokens from the header and cookies. */
@Component
public class JwtParser {

    private JwtConstants jwtConstants;

    @Autowired
    public JwtParser(JwtConstants jwtConstants) {
        this.jwtConstants = jwtConstants;
    }

    /**
     * Retrieves access jwt token from request header.
     * @param request from which to fetch header value
     * @return jwt access token
     */
    public String getAccessJwtFromHeader(HttpServletRequest request) {
        // fetch jwt from request header
        String jwt = request.getHeader(jwtConstants.getAccessJwtHeaderName());

        // jwt token if it is in header should start with Bearer word
        if (StringUtils.hasText(jwt) && jwt.startsWith("Bearer ")) {
            return jwt.substring("Bearer ".length());
        }

        return null;
    }

    /**
     * @return user id encapsulated within the access token.
     */
    public String getUserIdFromAccessJwt(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtConstants.getAccessJwtSecret())
                .parseClaimsJws(token)
                .getBody();

        return claims.get(jwtConstants.getAccessJwtUserIdClaimName(), String.class);
    }

    /**
     * @return user's granted authorities encapsulated within the token.
     */
    public Collection<GrantedAuthority> getUsersGrantedAuthoritiesFromAccessJwt(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtConstants.getAccessJwtSecret())
                .parseClaimsJws(token)
                .getBody();

        return claims.get(jwtConstants.getAccessJwtAuthoritiesClaimName(), Collection.class);
    }

    /**
     * @return token id encapsulated within the token.
     */
    public String getTokenIdFromRefreshJwt(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtConstants.getRefreshJwtSecret())
                .parseClaimsJws(token)
                .getBody();

        return claims.getId();
    }

    /**
     * @return email encapsulated within the token as id field.
     */
    public String getEmailFromEmailVerificationJwt(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtConstants.getEmailVerificationJwtSecret())
                .parseClaimsJws(token)
                .getBody();

        return claims.getId();
    }

    /**
     * @return email encapsulated within the token as id field.
     */
    public String getEmailFromPasswordRestoringJwt(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtConstants.getPasswordRestoringJwtSecret())
                .parseClaimsJws(token)
                .getBody();

        return claims.getId();
    }

}

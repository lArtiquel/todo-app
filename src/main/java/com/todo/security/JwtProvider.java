package com.todo.security;

import com.todo.model.AccessToken;
import com.todo.model.RefreshToken;
import com.todo.repository.RefreshTokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Date;

@Component
public class JwtProvider {

    @Value("${app.config.accessJwtSecret}")
    private String accessJwtSecret;

    @Value("${app.config.accessJwtExpirationS}")
    private Integer accessJwtExpirationS;

    @Value("${app.config.refreshJwtSecret}")
    private String refreshJwtSecret;

    @Value("${app.config.refreshJwtExpirationS}")
    private Integer refreshJwtExpirationS;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    /**
     * Generates access token and sets user id as a subject.
     * @param userId to set as jwt payload.
     * @return Access token object.
     */
    public AccessToken generateAccessJwt(String userId) {
        final Instant expiryDate = Instant.now().plusSeconds(accessJwtExpirationS);

        final String token = Jwts.builder()
                                .setSubject(userId)
                                .setIssuedAt(new Date())
                                .setExpiration(Date.from(expiryDate))
                                .signWith(SignatureAlgorithm.HS512, accessJwtSecret)
                                .compact();

        return new AccessToken(token, expiryDate.getEpochSecond());
    }

    /**
     * Generates refresh token.
     * @param userId that asks to generate the token.
     * @return Refresh token object.
     */
    public String generateRefreshJwt(String userId) {
        // calculate expiration date
        final Instant expiryDate = Instant.now().plusSeconds(refreshJwtExpirationS);

        // create token info model
        final RefreshToken refreshToken = new RefreshToken(userId, expiryDate.getEpochSecond());

        // save refresh token info model in db
        refreshTokenRepository.save(refreshToken);

        // generate refresh token, set token id as a subject
        return Jwts.builder()
                    .setSubject(refreshToken.getId())
                    .setIssuedAt(new Date())
                    .setExpiration(Date.from(expiryDate))
                    .signWith(SignatureAlgorithm.HS512, refreshJwtSecret)
                    .compact();
    }

    /**
     * Returns the user id encapsulated within the token.
     */
    public String getUserIdFromAccessJwt(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(accessJwtSecret)
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    /**
     * Returns token id encapsulated within the token.
     */
    public String getTokenIdFromRefreshJwt(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(refreshJwtSecret)
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public int getRefreshJwtMaxAgeInSec() { return refreshJwtExpirationS; }

}

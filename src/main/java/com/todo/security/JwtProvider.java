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
    public RefreshToken generateRefreshJwt(String userId) {
        // calculate expiration date
        final Instant expiryDate = Instant.now().plusSeconds(refreshJwtExpirationS);

        // create token info model
        final RefreshToken refreshTokenModel = new RefreshToken(userId, expiryDate.getEpochSecond());

        // save refresh token info model in db
        refreshTokenRepository.save(refreshTokenModel); // it's important to have this operation before token issuing because it sets id which needed there

        // generate refresh token, set token id as a subject
        final String refreshToken = Jwts.builder()
                    .setSubject(refreshTokenModel.getId())
                    .setIssuedAt(new Date())
                    .setExpiration(Date.from(expiryDate))
                    .signWith(SignatureAlgorithm.HS512, refreshJwtSecret)
                    .compact();

        // add refresh token to the model (yeah we are not persisting him)
        refreshTokenModel.setToken(refreshToken);

        return refreshTokenModel;
    }

    /**
     * Operations:
     * - Update refresh token expiration time in db.
     * - Issue new refresh token.
     * - Set new token to the model and return.
     * @param refreshTokenModel refresh token model to update
     */
    public RefreshToken updateRefreshToken(RefreshToken refreshTokenModel) {
        // update token expiration date in db
        final Instant expiryDate = Instant.now().plusSeconds(refreshJwtExpirationS);
        refreshTokenModel.setExpiredInSeconds(expiryDate.getEpochSecond());
        refreshTokenRepository.save(refreshTokenModel); // it's important to have this operation before token issuing because it sets id which needed there

        // now issue new token
        final String newRefreshToken = Jwts.builder()
                .setSubject(refreshTokenModel.getId())
                .setIssuedAt(new Date())
                .setExpiration(Date.from(expiryDate))
                .signWith(SignatureAlgorithm.HS512, refreshJwtSecret)
                .compact();

        // set new token to the module
        refreshTokenModel.setToken(newRefreshToken);

        return refreshTokenModel;
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

    /** Refresh JWT max age defined in props. */
    public int getRefreshJwtMaxAgeInSec() { return refreshJwtExpirationS; }

}

package com.todo.security.jwt;

import com.todo.model.AccessToken;
import com.todo.model.RefreshToken;
import com.todo.repository.RefreshTokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.*;

@Component
public class JwtProvider {

    private RefreshTokenRepository refreshTokenRepository;
    private JwtConstants jwtConstants;

    @Autowired
    public JwtProvider(RefreshTokenRepository refreshTokenRepository, JwtConstants jwtConstants) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtConstants = jwtConstants;
    }

    /**
     * Generate access token.
     * @param userId user id.
     * @param grantedAuthorities granted authorities.
     * @return Access token model.
     */
    public AccessToken generateAccessJwt(String userId, Collection<String> grantedAuthorities) {
        final Instant expiryDate = Instant.now().plusSeconds(jwtConstants.getAccessJwtExpirationTimeInSec());

        final String token = Jwts.builder()
                                .claim(jwtConstants.getAccessJwtUserIdClaimName(), userId)
                                .claim(jwtConstants.getAccessJwtAuthoritiesClaimName(), grantedAuthorities)
                                .setIssuedAt(new Date())
                                .setExpiration(Date.from(expiryDate))
                                .signWith(SignatureAlgorithm.HS512, jwtConstants.getAccessJwtSecret())
                                .compact();

        return new AccessToken(token);
    }

    /**
     * Generate refresh token.
     * @param userId that asks to generate the token.
     * @return Refresh token model.
     */
    public RefreshToken generateRefreshJwt(String userId) {
        // calculate expiration date
        final Instant expiryDate = Instant.now().plusSeconds(jwtConstants.getRefreshJwtExpirationTimeInSec());

        // create token info model
        final RefreshToken refreshTokenModel = new RefreshToken(userId, expiryDate.getEpochSecond());

        // save refresh token info model in db
        refreshTokenRepository.save(refreshTokenModel); // it's important to have this operation before token issuing because it sets id which needed there

        // generate refresh token, set token id as id claim
        final String refreshToken = Jwts.builder()
                    .setId(refreshTokenModel.getId())
                    .setIssuedAt(new Date())
                    .setExpiration(Date.from(expiryDate))
                    .signWith(SignatureAlgorithm.HS512, jwtConstants.getRefreshJwtSecret())
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
        final Instant expiryDate = Instant.now().plusSeconds(jwtConstants.getRefreshJwtExpirationTimeInSec());
        refreshTokenModel.setExpiredInSeconds(expiryDate.getEpochSecond());
        refreshTokenRepository.save(refreshTokenModel); // it's important to have this operation before token issuing because it sets id which needed there

        // now build new token
        final String newRefreshToken = Jwts.builder()
                .setId(refreshTokenModel.getId())
                .setIssuedAt(new Date())
                .setExpiration(Date.from(expiryDate))
                .signWith(SignatureAlgorithm.HS512, jwtConstants.getRefreshJwtSecret())
                .compact();

        // update token in the model
        refreshTokenModel.setToken(newRefreshToken);

        return refreshTokenModel;
    }

    /**
     * Generate email verification token.
     * @param email as a token id.
     * @return email verification token.
     */
    public String generateEmailVerificationToken(String email) {
        // build email verification token
        return Jwts.builder()
                .setId(email)
                .setIssuedAt(new Date())
                .signWith(SignatureAlgorithm.HS512, jwtConstants.getEmailVerificationJwtSecret())
                .compact();
    }

    /**
     * Generate reset password token.
     * @param email as a token id.
     * @return token for password restoring for that email.
     */
    public String generateResetPasswordToken(String email) {
        // build email verification token
        return Jwts.builder()
                .setId(email)
                .setIssuedAt(new Date())
                .setExpiration(Date.from(Instant.now().plusSeconds(jwtConstants.getResetPasswordJwtExpTimeInSec())))
                .signWith(SignatureAlgorithm.HS512, jwtConstants.getResetPasswordJwtSecret())
                .compact();
    }

}

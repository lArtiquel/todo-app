package com.todo.security.jwt;

import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/** Used to validate access and refresh tokens. */
@Component
public class JwtValidator {

	private static final Logger logger = LoggerFactory.getLogger(JwtValidator.class);

	private JwtConstants jwtConstants;

	@Autowired
	public JwtValidator(JwtConstants jwtConstants) {
		this.jwtConstants = jwtConstants;
	}

	/** JWT token types. */
	private enum ETokenTypes {
		ACCESS_TOKEN,
		REFRESH_TOKEN,
		EMAIL_VERIFICATION_TOKEN,
		RESET_PASSWORD_TOKEN
	}

	/**
	 * Validates if a token satisfies the following properties
	 * - Signature is not malformed
	 * - Token hasn't expired
	 * - Token is supported
	 * - Token has not recently been logged out.
	 */
	private boolean validateJwt(String authToken, ETokenTypes tokenType) {
		try {
			// set jwt secret accordingly to the passed token type
			final String jwtSecret;
			switch (tokenType){
				case ACCESS_TOKEN: jwtSecret = jwtConstants.getAccessJwtSecret(); break;
				case REFRESH_TOKEN: jwtSecret = jwtConstants.getRefreshJwtSecret(); break;
				case EMAIL_VERIFICATION_TOKEN: jwtSecret = jwtConstants.getEmailVerificationJwtSecret(); break;
				case RESET_PASSWORD_TOKEN: jwtSecret = jwtConstants.getResetPasswordJwtSecret(); break;
				default: throw new RuntimeException("Wrong token type!");
			}

			// parse jwt token
			Jwts.parser()
					.setSigningKey(jwtSecret)
					.parseClaimsJws(authToken);

			return true;
		} catch (SignatureException e) {
			logger.error("Invalid JWT signature: {}", e.getMessage());
		} catch (MalformedJwtException e) {
			logger.error("Invalid JWT token: {}", e.getMessage());
		} catch (ExpiredJwtException e) {
			logger.error("JWT token is expired: {}", e.getMessage());
		} catch (UnsupportedJwtException e) {
			logger.error("JWT token is unsupported: {}", e.getMessage());
		} catch (IllegalArgumentException e) {
			logger.error("JWT claims string is empty: {}", e.getMessage());
		} catch (RuntimeException e){
			logger.error("Error while fetching secret key: {}", e.getMessage());
		}

		return false;
	}

	/**
	 * Validate access jwt token.
	 */
	public boolean validateAccessJwt(String token) {
		return validateJwt(token, ETokenTypes.ACCESS_TOKEN);
	}

	/**
	 * Validate refresh jwt token.
	 */
	public boolean validateRefreshJwt(String token) { return validateJwt(token, ETokenTypes.REFRESH_TOKEN); }

	/**
	 * Validate email verification jwt token.
	 */
	public boolean validateEmailVerificationJwt(String token) {
		return validateJwt(token, ETokenTypes.EMAIL_VERIFICATION_TOKEN);
	}

	/**
	 * Validate jwt for password restoring.
	 */
	public boolean validateResetPasswordJwt(String token) { return validateJwt(token, ETokenTypes.RESET_PASSWORD_TOKEN); }
}

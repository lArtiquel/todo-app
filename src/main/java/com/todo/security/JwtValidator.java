package com.todo.security;

import com.todo.exception.NoSuchTokenTypeException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.*;

@Component
public class JwtValidator {

	private static final Logger logger = LoggerFactory.getLogger(JwtValidator.class);

	@Value("${app.config.accessJwtSecret}")
	private String accessJwtSecret;

	@Value("${app.config.refreshJwtSecret}")
	private String refreshJwtSecret;

	/** JWT token types. */
	private enum ETokenTypes {
		ACCESS_TOKEN,
		REFRESH_TOKEN
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
			// set jwt secret accordingly
			String jwtSecret = "";
			if(tokenType == ETokenTypes.ACCESS_TOKEN){
				jwtSecret = accessJwtSecret;
			} else if (tokenType == ETokenTypes.REFRESH_TOKEN) {
				jwtSecret = refreshJwtSecret;
			} else throw new NoSuchTokenTypeException("Wrong token type!");

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
		} catch (NoSuchTokenTypeException e) {
			logger.error("JWT secret assigning failed: {}", e.getMessage());
		}

		return false;
	}

	/**
	 * Validates jwt access token.
	 */
	public boolean validateAccessJwt(String authToken) {
		return validateJwt(authToken, ETokenTypes.ACCESS_TOKEN);
	}

	/**
	 * Validates refresh jwt token.
	 */
	public boolean validateRefreshJwt(String authToken) { return validateJwt(authToken, ETokenTypes.REFRESH_TOKEN); }
}

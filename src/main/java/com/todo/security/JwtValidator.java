package com.todo.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.*;

@Component
public class JwtValidator {

	private static final Logger logger = LoggerFactory.getLogger(JwtValidator.class);
	private final String jwtSecret;

	@Autowired
	public JwtValidator(@Value("${app.config.jwtSecret}") String jwtSecret) {
		this.jwtSecret = jwtSecret;
	}

	/**
	 * Validates if a token satisfies the following properties
	 * - Signature is not malformed
	 * - Token hasn't expired
	 * - Token is supported
	 * - Token has not recently been logged out.
	 */
	public boolean validateJwtToken(String authToken) {
		try {
			Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
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
		}

		return false;
	}
}

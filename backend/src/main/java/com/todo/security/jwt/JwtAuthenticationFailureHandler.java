package com.todo.security.jwt;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

/**
 * Used to handle authentication failure properly.
 */
@Component
public class JwtAuthenticationFailureHandler implements AuthenticationEntryPoint {

	private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFailureHandler.class);

	/** This method is invoked when user tries to access a secured REST resource without supplying any credentials. */
	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException authException) throws IOException, ServletException {
		logger.error("Unauthorized error: {}", authException.getMessage());
		// just send a 401 Unauthorized response because there is no 'login page' to redirect to
		response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Prevented from accessing protected route without supplying any credentials!");
	}

}

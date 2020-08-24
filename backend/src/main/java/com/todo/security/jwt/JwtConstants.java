package com.todo.security.jwt;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class JwtConstants {

    @Value("${app.config.jwt.access.header}")
    private String accessJwtHeaderName;

    @Value("${app.config.jwt.access.claim.userId}")
    private String accessJwtUserIdClaimName;

    @Value("${app.config.jwt.access.claim.authorities}")
    private String accessJwtAuthoritiesClaimName;

    @Value("${app.config.jwt.access.secret}")
    private String accessJwtSecret;

    @Value("${app.config.jwt.access.expirationTimeInSec}")
    private Integer accessJwtExpirationTimeInSec;

    @Value("${app.config.jwt.refresh.secret}")
    private String refreshJwtSecret;

    @Value("${app.config.jwt.refresh.expirationTimeInSec}")
    private Integer refreshJwtExpirationTimeInSec;

    @Value("${app.config.jwt.emailVerification.secret}")
    private String emailVerificationJwtSecret;

    @Value("${app.config.jwt.resetPassword.secret}")
    private String resetPasswordJwtSecret;

    @Value("${app.config.jwt.resetPassword.expirationTimeInSec}")
    private Integer resetPasswordJwtExpTimeInSec;

}

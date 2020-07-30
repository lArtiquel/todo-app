package com.todo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Refresh token info model stored in db.
 * Does not contain actual token, it only indicates that such token exists.
 */
@Document(collection = "refresh_tokens")
public class RefreshToken {

    /** Refresh token id. */
    @Id
    private String id;

    /** Actual refresh token. Field is transient, means it not persisted in database. */
    @Transient
    private String token;

    /** User id who owns the token. */
    private String userId;

    /** Token expiration time */
    private Long expiredInSeconds;

    public RefreshToken(String userId, Long expiredInSeconds) {
        this.userId = userId;
        this.expiredInSeconds = expiredInSeconds;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Long getExpiredInSeconds() {
        return expiredInSeconds;
    }

    public void setExpiredInSeconds(Long expiredInSeconds) {
        this.expiredInSeconds = expiredInSeconds;
    }

}

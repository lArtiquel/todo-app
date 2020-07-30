package com.todo.model;

import lombok.Data;
import lombok.NonNull;

/** Generated access token model. */
@Data
public class AccessToken {

    /** Access token */
    @NonNull
    private String token;

    /** When token will be expired */
    @NonNull
    private Long expiredInSeconds;

}

package com.todo.payload.response;

import lombok.Data;
import lombok.NonNull;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.Set;

@Data
public class RefreshResponse {

    @NonNull
    private String accessToken;

    @NonNull
    private String refreshToken;

    @NonNull
    private Collection<String> authorities;

}

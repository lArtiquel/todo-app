package com.todo.payload.response;

import lombok.Data;
import lombok.NonNull;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@Data
public class LoginResponse{

    @NonNull
    private String accessToken;

    @NonNull
    private String refreshToken;

    @NonNull
    private Collection<String> authorities;

}

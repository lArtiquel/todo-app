package com.todo.payload.response;

import lombok.Data;
import lombok.NonNull;

import java.util.List;
import java.util.Set;

@Data
public class JwtResponse implements IResponsePayload {

    @NonNull
    private String accessToken;

    @NonNull
    private Set<String> roles;

}

package com.todo.payload.response;

import lombok.Data;
import lombok.NonNull;

@Data
public class RefreshResponse {

    @NonNull
    private String accessToken;

    @NonNull
    private String refreshToken;

}

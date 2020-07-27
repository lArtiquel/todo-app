package com.todo.payload.response;

import lombok.Data;
import lombok.NonNull;

@Data
public class RefreshResponse implements IResponsePayload {

    @NonNull
    private String accessToken;

    @NonNull
    private Long accessTokenExpiredInSeconds;

    @NonNull
    private String refreshToken;

}

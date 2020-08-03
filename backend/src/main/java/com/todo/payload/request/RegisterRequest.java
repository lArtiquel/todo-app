package com.todo.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NonNull;

@AllArgsConstructor
@Data
public class RegisterRequest {

    @NonNull
    private String username;

    @NonNull
    private String password;

}
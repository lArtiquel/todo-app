package com.todo.payload.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import java.time.Instant;

/**
 * Plain message response.
 */
@Data
public class PlainMessageResponse {

    /**
     * Provided message to the frontend.
     */
    @NonNull
    private String message;

}

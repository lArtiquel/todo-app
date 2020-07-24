package com.todo.payload.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

/**
 * Generic Api Response model.
 * @param <T> payload type
 */
@AllArgsConstructor
@RequiredArgsConstructor
@Data
public class ApiResponse<T extends IResponsePayload> {

    /**
     * Error status. True - successful operation, false - operation failed.
     */
    @NonNull
    private Boolean error;

    /**
     * Provided message to the frontend.
     */
    @NonNull
    private String message;

    /**
     * Some payload provided by server. Field is not requred.
     */
    @JsonInclude(Include.NON_NULL)
    private T payload;

}

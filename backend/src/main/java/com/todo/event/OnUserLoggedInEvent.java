package com.todo.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class OnUserLoggedInEvent extends ApplicationEvent {

    private String userId;

    public OnUserLoggedInEvent(String userId) {
        super(userId);
        this.userId = userId;
    }

}

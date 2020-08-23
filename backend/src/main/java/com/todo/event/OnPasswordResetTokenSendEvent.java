package com.todo.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class OnPasswordResetTokenSendEvent extends ApplicationEvent {

    private String mailAddress;
    private String token;

    public OnPasswordResetTokenSendEvent(String mailAddress, String token) {
        super(mailAddress + ": " + token);
        this.mailAddress = mailAddress;
        this.token = token;
    }

}

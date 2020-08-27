package com.todo.event.listener;

import com.todo.event.OnEmailVerificationRequiredEvent;
import com.todo.event.OnPasswordResetTokenSendEvent;
import com.todo.service.EmailServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.mail.MailException;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class OnPasswordResetTokenSendListener {

    private Logger log = LoggerFactory.getLogger(OnPasswordResetTokenSendListener.class);

    @Value("${app.config.frontend.url}")
    private String frontendUrl;

    private EmailServiceImpl emailService;

    @Autowired
    public OnPasswordResetTokenSendListener(EmailServiceImpl emailService) {
        this.emailService = emailService;
    }

    /** Send message to email with reset password token. */
    @Async
    @EventListener
    public void onApplicationEvent(OnPasswordResetTokenSendEvent event) {
        String linkToResetApiMethod = frontendUrl + "/reset-password/enter-password?token=";
        String linkToCancelResetApiMethod = frontendUrl + "/cancel-password-reset?token=";
        try {
            emailService.sendSimpleMessage(event.getMailAddress(), "Arti's Todo App Password Reset.",
                            "To reset password go by this link --> " + linkToResetApiMethod + event.getToken() + ".\n" +
                            "If you did not do this action, please, go by this link --> " + linkToCancelResetApiMethod + event.getToken() + ".\n\n\n" +
                            "Best regards, Arti Tsv.");
        } catch (MailException e) {
            log.error(e.getMessage());
        }
    }

}

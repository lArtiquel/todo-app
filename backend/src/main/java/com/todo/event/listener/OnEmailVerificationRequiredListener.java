package com.todo.event.listener;

import com.todo.event.OnEmailVerificationRequiredEvent;
import com.todo.service.EmailServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.EventListener;
import org.springframework.mail.MailException;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class OnEmailVerificationRequiredListener {

    private Logger log = LoggerFactory.getLogger(OnEmailVerificationRequiredListener.class);

    @Value("${app.config.frontend.url}")
    private String frontendUrl;

    private EmailServiceImpl emailService;

    @Autowired
    public OnEmailVerificationRequiredListener(EmailServiceImpl emailService) {
        this.emailService = emailService;
    }

    /** Send message to email with verification token. */
    @Async
    @EventListener
    public void onApplicationEvent(OnEmailVerificationRequiredEvent event) {
        String linkToVerifyApiMethod = frontendUrl + "/verify-email?token=";
        String linkToCancelVerifyApiMethod = frontendUrl + "/cancel-email-verify?token=";
        try {
            emailService.sendSimpleMessage(event.getMailAddress(), "Arti's Todo App Email Verification.",
                    "First of all, I pleased to see you here. \n" +
                            "Please, verify email by this link --> " + linkToVerifyApiMethod + event.getToken() + ".\n" +
                            "If you did not do this action, please, go by this link --> " + linkToCancelVerifyApiMethod + event.getToken() + ".\n\n\n" +
                            "Best regards, Arti Tsv.");
        } catch (MailException e) {
            log.error(e.getMessage());
        }
    }

}

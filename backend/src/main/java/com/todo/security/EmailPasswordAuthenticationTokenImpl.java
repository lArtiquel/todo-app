package com.todo.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;

public class EmailPasswordAuthenticationTokenImpl extends AbstractAuthenticationToken {

    private String principal;
    private String credentials;

    public EmailPasswordAuthenticationTokenImpl(String email, String password){
        super(null);
        super.setAuthenticated(false);
        this.principal = email;
        this.credentials = password;
    }

    @Override
    public String getCredentials() {
        return credentials;
    }

    @Override
    public String getPrincipal() {
        return principal;
    }

}

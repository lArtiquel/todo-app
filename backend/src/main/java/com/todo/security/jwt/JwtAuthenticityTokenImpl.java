package com.todo.security.jwt;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import javax.validation.constraints.NotBlank;
import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

public class JwtAuthenticityTokenImpl extends AbstractAuthenticationToken {

    private String userId;

    public JwtAuthenticityTokenImpl(@NotBlank String userId, Collection<GrantedAuthority> grantedAuthorities){
        super(grantedAuthorities);
        super.setAuthenticated(true);
        this.userId = userId;
    }

    @Override
    public String getPrincipal() {
        return userId;
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Collection<GrantedAuthority> getAuthorities() {
        return super.getAuthorities();
    }

}

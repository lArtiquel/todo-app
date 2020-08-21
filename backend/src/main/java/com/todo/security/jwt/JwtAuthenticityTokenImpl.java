package com.todo.security.jwt;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import javax.validation.constraints.NotBlank;
import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

public class JwtAuthorizationTokenImpl extends AbstractAuthenticationToken {

    private String userId;

    public JwtAuthorizationTokenImpl(@NotBlank String userId, Collection<? extends GrantedAuthority> grantedAuthorities){
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

    public Set<String> getSetOfStringAuthorities() {
        return super.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());
    }

}

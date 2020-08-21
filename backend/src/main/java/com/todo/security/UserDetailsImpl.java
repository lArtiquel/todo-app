package com.todo.security;

import com.todo.model.User;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

/** Builds user details from passed user info. */
@RequiredArgsConstructor
public class UserDetailsImpl implements UserDetails {

    @NonNull
    @Getter @Setter
    private String id;

    // this field is redundant in this app
    // but it needed here because UserDetails have it
    @Getter
    private String username;

    @NonNull
    @Getter @Setter
    private String email;

    @NonNull
    @Getter @Setter
    private String password;

    @NonNull
    @Getter @Setter
    private Collection<GrantedAuthority> authorities;

    @NonNull
    private Boolean isEnabled;

    public static UserDetailsImpl build(User user) {
        Set<GrantedAuthority> authorities = user.getRoles()
                        .stream()
                        .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                        .collect(Collectors.toSet());

        return new UserDetailsImpl(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                authorities,
                user.getEmailVerificationToken() != null);
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isEnabled;
    }

}

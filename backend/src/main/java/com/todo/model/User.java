package com.todo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Set;

/** Users collection model. */
@Document(collection = "users")
public class User {

    @Id
    private String id;

    /** Unique username */
    @Indexed(unique=true)
    @NotBlank
    @Size(max = 40)
    private String email;

    /** Hashed password */
    @NotBlank
    private String password;

    /** Set of user roles(referenced to the Roles collection) */
    @NotBlank
    @DBRef
    private Set<Role> roles;

    /** Token used for email verification. */
    private String emailVerificationToken;

    /** Token used for password restoring. */
    private String passwordRestoringToken;

    public User(@NotBlank @Size(max = 40) String email, @NotBlank String password,
                @NotBlank Set<Role> roles, @NotBlank String emailVerificationToken) {
        this.email = email;
        this.password = password;
        this.roles = roles;
        this.emailVerificationToken = emailVerificationToken;
        this.passwordRestoringToken = null;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public String getEmailVerificationToken() {
        return emailVerificationToken;
    }

    public void setEmailVerificationToken(String emailVerificationToken) {
        this.emailVerificationToken = emailVerificationToken;
    }

    public String getPasswordRestoringToken() {
        return passwordRestoringToken;
    }

    public void setPasswordRestoringToken(String passwordRestoringToken) {
        this.passwordRestoringToken = passwordRestoringToken;
    }
}

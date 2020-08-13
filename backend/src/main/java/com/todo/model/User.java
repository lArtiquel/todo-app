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
    @DBRef
    private Set<Role> roles;

    public User(@NotBlank @Size(max = 40) String email, @NotBlank String password, Set<Role> roles) {
        this.email = email;
        this.password = password;
        this.roles = roles;
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
}

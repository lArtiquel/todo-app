package com.todo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/** Roles collection model. */
@Document(collection = "roles")
public class Role {

    /** Generated role id */
    @Id
    private String id;

    /** Role name */
    private ERole name;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public ERole getName() {
        return name;
    }

    public void setName(ERole name) {
        this.name = name;
    }
}

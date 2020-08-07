package com.todo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="todos")
public class Todo {

    @Id
    private String id;

    @JsonIgnore
    private String ownerId;

    private String body;

    private Boolean isDone;

    public Todo(String ownerId, String body, Boolean isDone) {
        this.ownerId = ownerId;
        this.body = body;
        this.isDone = isDone;
    }

    public String getId() {
        return id;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public Boolean getDone() {
        return isDone;
    }

    public void setDone(Boolean done) {
        isDone = done;
    }

}

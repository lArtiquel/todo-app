package com.todo.repository;

import com.todo.model.Todo;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TodoRepository extends MongoRepository<Todo, String> {
    Optional<Todo> findByIdAndOwnerId(String id, String ownerId);
    List<Todo> findAllByOwnerId(String ownerId);
}

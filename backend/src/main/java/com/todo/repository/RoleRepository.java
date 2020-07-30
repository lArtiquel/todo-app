package com.todo.repository;

import java.util.Optional;

import com.todo.model.ERole;
import com.todo.model.Role;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoleRepository extends MongoRepository<Role, String> {
    Optional<Role> findByName(ERole name);
}

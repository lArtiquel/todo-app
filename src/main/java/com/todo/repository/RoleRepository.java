package com.todo.repository;

import java.util.Optional;

import com.todo.models.ERole;
import com.todo.models.Role;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoleRepository extends MongoRepository<Role, String> {
  Optional<Role> findByName(ERole name);
}

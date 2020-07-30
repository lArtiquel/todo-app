package com.todo.repository;

import com.todo.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

  Boolean existsByUsername(String username);

  @Query("{ 'roles' : ?0 }")
  List<User> findByRoles(String id);

  Optional<User> findById(Long id);

  Optional<User> findByUsername(String username);

}

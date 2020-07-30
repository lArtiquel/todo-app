package com.todo.repository;

import com.todo.model.RefreshToken;
import com.todo.model.Role;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface RefreshTokenRepository extends MongoRepository<RefreshToken, String> {
    Optional<RefreshToken> findById(String id);
    void deleteByUserIdAndExpiredInSecondsBefore(String userId, Long currentTimeInSeconds);
}

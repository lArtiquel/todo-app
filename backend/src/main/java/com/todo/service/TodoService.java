package com.todo.service;

import com.todo.model.Todo;
import com.todo.repository.TodoRepository;
import com.todo.security.UserDetailsImpl;
import com.todo.security.jwt.JwtAuthenticityTokenImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TodoService {

    private TodoRepository todoRepository;

    @Autowired
    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    public String getUserIdFromAuthenticityToken() {
        return (String)SecurityContextHolder.getContext().getAuthentication().getCredentials();
    }

    public List<Todo> getAll() {
        final String userId = getUserIdFromAuthenticityToken();
        return todoRepository.findAllByOwnerId(userId);
    }

    public Todo createTodo(String todoBody) {
        final String userId = getUserIdFromAuthenticityToken();
        final Todo todo = new Todo(userId, todoBody, false);
        return todoRepository.save(todo);
    }

    public void toggleTodoIsDoneFlag(String todoId) {
        final String userId = getUserIdFromAuthenticityToken();
        final Todo todo = todoRepository.findByIdAndOwnerId(todoId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT, "User with such id does not have such todo."));
        todo.setDone(!todo.getDone());
        todoRepository.save(todo);
    }

    public void changeTodoBody(String todoId, String todoBody) {
        final String userId = getUserIdFromAuthenticityToken();
        final Todo todo = todoRepository.findByIdAndOwnerId(todoId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT, "User with such id does not have such todo."));
        todo.setBody(todoBody);
        todoRepository.save(todo);
    }

    public void deleteTodo(String todoId) {
        final String userId = getUserIdFromAuthenticityToken();
        final Todo todo = todoRepository.findByIdAndOwnerId(todoId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT, "User with such id does not have such todo."));
        todoRepository.delete(todo);
    }

}

package com.todo.service;

import com.todo.model.Todo;
import com.todo.repository.TodoRepository;
import com.todo.security.UserDetailsImpl;
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
public class TodoService {

    private TodoRepository todoRepository;

    @Autowired
    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @Transactional
    public List<Todo> getAll() {
        final UserDetailsImpl userDetails = (UserDetailsImpl)SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return todoRepository.findAllByOwnerId(userDetails.getId());
    }

    @Transactional
    public Todo createTodo(String todoBody) {
        final UserDetailsImpl userDetails = (UserDetailsImpl)SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        final Todo todo = new Todo(userDetails.getId(), todoBody, false);
        return todoRepository.save(todo);
    }

    @Transactional
    public void toggleTodoIsDoneFlag(String todoId) {
        final UserDetailsImpl userDetails = (UserDetailsImpl)SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        final Todo todo = todoRepository.findByIdAndOwnerId(todoId, userDetails.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT, "User with such id does not have such todo."));
        todo.setDone(!todo.getDone());
        todoRepository.save(todo);
    }

    @Transactional
    public void changeTodoBody(String todoId, String todoBody) {
        final UserDetailsImpl userDetails = (UserDetailsImpl)SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        final Todo todo = todoRepository.findByIdAndOwnerId(todoId, userDetails.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT, "User with such id does not have such todo."));
        todo.setBody(todoBody);
        todoRepository.save(todo);
    }

    @Transactional
    public void deleteTodo(String todoId) {
        final UserDetailsImpl userDetails = (UserDetailsImpl)SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        final Todo todo = todoRepository.findByIdAndOwnerId(todoId, userDetails.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT, "User with such id does not have such todo."));
        todoRepository.delete(todo);
    }

}

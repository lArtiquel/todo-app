package com.todo.controller;

import com.todo.model.Todo;
import com.todo.payload.request.LoginRequest;
import com.todo.payload.response.ApiResponse;
import com.todo.payload.response.LoginResponse;
import com.todo.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.List;

/**
 * Simple class to test authorization.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class TodoController {

    private TodoService todoService;

    @Autowired
    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping("/todos")
    public ResponseEntity<?> getAll() {
        final List<Todo> todos = todoService.getAll();

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(todos);
    }

    @PostMapping(value = "/todos", params = "todoBody")
    public ResponseEntity<?> createTodo(@RequestParam String todoBody) {
        final Todo todo = todoService.createTodo(todoBody);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(todo);
    }

    @PatchMapping(value="/todos/{id}")
    public ResponseEntity<?> toggleTodoIsDoneFlag(@PathVariable String id) {
        todoService.toggleTodoIsDoneFlag(id);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(null);
    }

    @PatchMapping(value="/todos/{id}", params = "todoBody")
    public ResponseEntity<?> changeTodoBody(@PathVariable String id, @RequestParam String todoBody) {
        todoService.changeTodoBody(id, todoBody);

        return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .body(null);
    }

    @DeleteMapping(value="/todos/{id}")
    public ResponseEntity<?> deleteTodo(@PathVariable String id) {
        todoService.deleteTodo(id);

        return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .body(null);
    }

}

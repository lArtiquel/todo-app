package com.todo.controller;

import com.todo.model.Todo;
import com.todo.payload.response.RefreshResponse;
import com.todo.service.TodoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @Operation(summary = "Get all user's todos.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200", description = "Ok. Here is list of your todos, user.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Todo.class)) })
    })
    @GetMapping("/todos")
    public ResponseEntity<?> getAll() {
        final List<Todo> todos = todoService.getAll();

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(todos);
    }

    @Operation(summary = "Create new todo.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200", description = "Todo created successfully.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Todo.class)) }),
            @ApiResponse(
                    responseCode = "409", description = "User don't have such todo.",
                    content = @Content)})
    @PostMapping(value = "/todos", params = "todoBody")
    public ResponseEntity<?> createTodo(@RequestParam String todoBody) {
        final Todo todo = todoService.createTodo(todoBody);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(todo);
    }

    @Operation(summary = "Toggle todo's isDone flag.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "204", description = "Flag toggled successfully.",
                    content = @Content),
            @ApiResponse(
                    responseCode = "409", description = "User don't have such todo.",
                    content = @Content)})
    @PatchMapping(value="/todos/{id}")
    public ResponseEntity<?> toggleTodoIsDoneFlag(@PathVariable String id) {
        todoService.toggleTodoIsDoneFlag(id);

        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .body(null);
    }

    @Operation(summary = "Change todo's body.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "204", description = "Body changed successfully.",
                    content = @Content),
            @ApiResponse(
                    responseCode = "409", description = "User don't have such todo.",
                    content = @Content)})
    @PatchMapping(value="/todos/{id}", params = "todoBody")
    public ResponseEntity<?> changeTodoBody(@PathVariable String id, @RequestParam String todoBody) {
        todoService.changeTodoBody(id, todoBody);

        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .body(null);
    }

    @Operation(summary = "Delete todo.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "204", description = "Todo deleted successfully.",
                    content = @Content),
            @ApiResponse(
                    responseCode = "409", description = "User don't have such todo.",
                    content = @Content)})
    @DeleteMapping(value="/todos/{id}")
    public ResponseEntity<?> deleteTodo(@PathVariable String id) {
        todoService.deleteTodo(id);

        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .body(null);
    }

}

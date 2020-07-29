package com.todo.controller;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Simple class to test authorization.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/board")
public class BoardController {

    @Operation(summary = "Public content, i.e. available to everyone.")
    @GetMapping("/all")
    public String allAccess() {
        return "Public Content.";
    }

    @Operation(summary = "User's content, i.e. available to users with 'USER' role.")
    @GetMapping("/user")
    public String userAccess() {
        return "User Content.";
    }

    @Operation(summary = "Admin's content, i.e. available to users with 'ADMIN' role.")
    @GetMapping("/admin")
    public String adminAccess() {
        return "Admin Board.";
    }

}

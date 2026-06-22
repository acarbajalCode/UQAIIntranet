package com.uqai.backend.controller;

import com.uqai.backend.dto.*;
import com.uqai.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // Endpoint seguro para registrar un nuevo usuario operador
    @PostMapping("/register")
    public ResponseEntity<?> registrar(@Valid @RequestBody RegisterRequest request) {
        try {
            UsuarioResponse response = authService.registrar(request);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            // OWASP A04: Retornar mensajes controlados sin exponer trazas de error
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Endpoint para el inicio de sesión con emisión de Token JWT
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            // Retorna un error 401 si las credenciales fallan, protegiendo el sistema
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }
}
package com.uqai.backend.controller;

import com.uqai.backend.entity.Lead;
import com.uqai.backend.service.LeadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    // POST /api/leads -> Endpoint PÚBLICO para la Landing Page
    @PostMapping
    public ResponseEntity<Lead> crearLead(@Valid @RequestBody Lead lead) {
        Lead guardado = leadService.guardarLead(lead);
        return new ResponseEntity<>(guardado, HttpStatus.CREATED);
    }

    // GET /api/leads -> Endpoint PRIVADO (Solo accesible por ADMIN - validado en SecurityConfig)
    @GetMapping
    public ResponseEntity<List<Lead>> listarLeads() {
        List<Lead> lista = leadService.listarTodos();
        return ResponseEntity.ok(lista);
    }
}
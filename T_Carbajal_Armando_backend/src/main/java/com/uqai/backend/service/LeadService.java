package com.uqai.backend.service;

import com.uqai.backend.entity.Lead;
import com.uqai.backend.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;

    // Guardar un lead (público: cualquier cliente puede enviar su consulta)
    public Lead guardarLead(Lead lead) {
        return leadRepository.save(lead);
    }

    // Listar todos los leads (privado: solo visible para el rol ADMIN)
    public List<Lead> listarTodos() {
        return leadRepository.findAll();
    }
}
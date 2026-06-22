package com.uqai.backend.repository;

import com.uqai.backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Método crítico para buscar por email único durante el login seguro
    Optional<Usuario> findByEmail(String email);
    
    // Método para validar que no existan emails duplicados en el registro
    boolean existsByEmail(String email);
}
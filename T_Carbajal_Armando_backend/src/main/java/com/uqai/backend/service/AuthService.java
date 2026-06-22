package com.uqai.backend.service;

import com.uqai.backend.dto.*;
import com.uqai.backend.entity.Rol;
import com.uqai.backend.entity.Usuario;
import com.uqai.backend.repository.UsuarioRepository;
import com.uqai.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // Lógica para registrar usuarios de forma segura (Cifrado BCrypt)
    public UsuarioResponse registrar(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("El correo electrónico ya se encuentra registrado.");
        }

        Usuario nuevoUsuario = Usuario.builder()
                .nombre(request.getNombre())
                .apellidos(request.getApellidos())
                .email(request.getEmail())
                // Aplicamos el hash seguro de 12 rondas configurado en SecurityConfig
                .password(passwordEncoder.encode(request.getPassword()))
                .rol(Rol.USER) // Por defecto se registran con rol de usuario estándar
                .area(request.getArea())
                .build();

        Usuario guardado = usuarioRepository.save(nuevoUsuario);
        return UsuarioResponse.from(guardado);
    }

    // Lógica para iniciar sesión y emitir el Token Digital firmado
    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Credenciales incorrectas o el usuario no existe."));

        // Validación segura contra ataques de fuerza bruta usando comparación robusta
        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new IllegalArgumentException("Credenciales incorrectas o el usuario no existe.");
        }

        // Generamos el token JWT firmado con HS256 si los accesos son correctos
        String token = jwtService.generateToken(usuario.getEmail());
        return new AuthResponse(token, usuario.getRol().name(), "SUCCESS");
    }
}
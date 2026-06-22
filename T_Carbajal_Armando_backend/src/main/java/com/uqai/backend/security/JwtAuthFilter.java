package com.uqai.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.uqai.backend.repository.UsuarioRepository;
import com.uqai.backend.entity.Usuario;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepo;

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 1. Validar si el header viene con el formato estándar Bearer
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        try {
            userEmail = jwtService.extractEmail(jwt);

            // 2. Si el token tiene email y el usuario no está autenticado aún en el contexto
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                Usuario usuario = usuarioRepo.findByEmail(userEmail).orElse(null);

                if (usuario != null) {
                    // Mapeamos el rol del usuario con el formato que entiende Spring Security ("ROLE_ADMIN", "ROLE_USER")
                    UserDetails userDetails = User.builder()
                        .username(usuario.getEmail())
                        .password(usuario.getPassword())
                        .roles(usuario.getRol().name())
                        .build();

                    // 3. Si el token es válido criptográficamente, lo metemos al contexto de seguridad
                    if (jwtService.isTokenValid(jwt, userDetails)) {
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                        );
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            }
        } catch (Exception e) {
            // Si el token es inválido o expiró, no se autentica y el filtro denegará el acceso
        }

        filterChain.doFilter(request, response);
    }
}
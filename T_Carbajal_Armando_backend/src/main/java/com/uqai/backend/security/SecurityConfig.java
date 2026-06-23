package com.uqai.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            // 1. Modificación: Desactivar CSRF de forma explícita ignorando h2-console
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/h2-console/**")
                .disable()
            )
            // 2. Acoplar la configuración de orígenes cruzados (CORS)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // 3. Declarar la política de sesiones como totalmente SIN ESTADO (Stateless)
            // NOTA: Para h2-console requerimos permitir creación de sesión local interna
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
            // 4. Configurar el control de accesos a los endpoints (RBAC)
            .authorizeHttpRequests(auth -> auth
                // Rutas públicas de autenticación y consola H2 de desarrollo
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                // Permitir que cualquier visitante de la landing page envíe un lead de contacto
                .requestMatchers(HttpMethod.POST, "/api/leads").permitAll()
                // Rutas restringidas exclusivamente para usuarios con Rol de Administrador
                .requestMatchers("/api/usuarios/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/leads").hasRole("ADMIN")
                // Cualquier otra solicitud requiere autenticación obligatoria
                .anyRequest().authenticated()
            )
            // 5. Permitir que la consola H2 cargue sus páneles internos en frames HTML de desarrollo
            .headers(h -> h.frameOptions(f -> f.disable()))
            // 6. Inyectar nuestro filtro JWT personalizado antes de la verificación por contraseña nativa
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Permitir conexiones explícitas desde tu entorno de desarrollo local y tus despliegues en Vercel
        //config.setAllowedOrigins(List.of("http://localhost:3000", "https://*.vercel.app"));
        // CORRECCIÓN: Usamos patrones permitidos para soportar el subdominio de Vercel y mantener localhost funcional
        config.setAllowedOriginPatterns(List.of(
            "http://localhost:3000", 
            "https://uqai-intranet.vercel.app",
            "https://*-armando-intranet.vercel.app"
        ));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        // CRÍTICO: Permitir el intercambio seguro de Cookies HttpOnly cross-site
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Criptografía recomendada por el examen: BCrypt con factor de costo 12 (OWASP A02)
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
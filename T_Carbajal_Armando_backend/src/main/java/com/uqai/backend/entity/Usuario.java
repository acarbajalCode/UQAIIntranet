package com.uqai.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "usuarios")
@Data 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor
public class Usuario {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank 
    private String nombre;

    @Column(nullable = false)
    @NotBlank 
    private String apellidos;

    @Column(unique = true, nullable = false)
    @Email 
    private String email;

    @Column(nullable = false)
    private String password; // SIEMPRE hash bcrypt, nunca texto plano

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol; // enum: ADMIN o USER

    @Column(nullable = false)
    @NotBlank 
    private String area;
}
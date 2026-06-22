package com.uqai.backend.dto;

import com.uqai.backend.entity.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UsuarioResponse {
    private Long id;
    private String nombre;
    private String apellidos;
    private String email;
    private String rol;
    private String area;

    public static UsuarioResponse from(Usuario u) {
        return new UsuarioResponse(u.getId(), u.getNombre(), u.getApellidos(), u.getEmail(), u.getRol().name(), u.getArea());
    }
}
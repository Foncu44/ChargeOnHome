package com.chargeonhome.backend.dto;

import com.chargeonhome.backend.model.TipoUsuario;
import java.time.LocalDateTime;

public class UsuarioResponse {
    
    private Long id;
    private String nombre;
    private String apellidos;
    private String email;
    private String telefono;
    private TipoUsuario tipoUsuario;
    private Boolean verificado;
    private LocalDateTime fechaRegistro;
    
    // Constructores
    public UsuarioResponse() {}
    
    public UsuarioResponse(Long id, String nombre, String apellidos, String email, 
                          String telefono, TipoUsuario tipoUsuario, Boolean verificado, 
                          LocalDateTime fechaRegistro) {
        this.id = id;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.telefono = telefono;
        this.tipoUsuario = tipoUsuario;
        this.verificado = verificado;
        this.fechaRegistro = fechaRegistro;
    }
    
    // Getters y Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public String getApellidos() {
        return apellidos;
    }
    
    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getTelefono() {
        return telefono;
    }
    
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
    
    public TipoUsuario getTipoUsuario() {
        return tipoUsuario;
    }
    
    public void setTipoUsuario(TipoUsuario tipoUsuario) {
        this.tipoUsuario = tipoUsuario;
    }
    
    public Boolean getVerificado() {
        return verificado;
    }
    
    public void setVerificado(Boolean verificado) {
        this.verificado = verificado;
    }
    
    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }
    
    public void setFechaRegistro(LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }
} 
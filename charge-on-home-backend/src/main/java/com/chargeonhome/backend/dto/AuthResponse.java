package com.chargeonhome.backend.dto;

public class AuthResponse {
    
    private String token;
    private String mensaje;
    private boolean exito;
    private UsuarioResponse usuario;
    
    // Constructores
    public AuthResponse() {}
    
    public AuthResponse(String token, String mensaje, boolean exito) {
        this.token = token;
        this.mensaje = mensaje;
        this.exito = exito;
    }
    
    public AuthResponse(String token, String mensaje, boolean exito, UsuarioResponse usuario) {
        this.token = token;
        this.mensaje = mensaje;
        this.exito = exito;
        this.usuario = usuario;
    }
    
    // Getters y Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getMensaje() {
        return mensaje;
    }
    
    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
    
    public boolean isExito() {
        return exito;
    }
    
    public void setExito(boolean exito) {
        this.exito = exito;
    }
    
    public UsuarioResponse getUsuario() {
        return usuario;
    }
    
    public void setUsuario(UsuarioResponse usuario) {
        this.usuario = usuario;
    }
} 
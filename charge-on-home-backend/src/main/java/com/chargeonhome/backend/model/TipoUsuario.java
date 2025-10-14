package com.chargeonhome.backend.model;

public enum TipoUsuario {
    PROPIETARIO("Propietario de garaje"),
    CLIENTE("Cliente que busca cargar"),
    AMBOS("Propietario y cliente");
    
    private final String descripcion;
    
    TipoUsuario(String descripcion) {
        this.descripcion = descripcion;
    }
    
    public String getDescripcion() {
        return descripcion;
    }
} 
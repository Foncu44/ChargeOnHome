package com.chargeonhome.backend.model;

public enum EstadoReserva {
    PENDIENTE("Pendiente de confirmación"),
    CONFIRMADA("Confirmada"),
    EN_CURSO("En curso"),
    COMPLETADA("Completada"),
    CANCELADA("Cancelada"),
    NO_PRESENTADO("No se presentó");
    
    private final String descripcion;
    
    EstadoReserva(String descripcion) {
        this.descripcion = descripcion;
    }
    
    public String getDescripcion() {
        return descripcion;
    }
} 
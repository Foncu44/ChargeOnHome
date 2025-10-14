package com.chargeonhome.backend.model;

public enum TipoConector {
    TIPO_1("Tipo 1 (SAE J1772)"),
    TIPO_2("Tipo 2 (Mennekes)"),
    CCS_COMBO_1("CCS Combo 1"),
    CCS_COMBO_2("CCS Combo 2"),
    CHADEMO("CHAdeMO"),
    TESLA_SUPERCHARGER("Tesla Supercharger"),
    SCHUKO("Schuko (enchufe doméstico)");
    
    private final String descripcion;
    
    TipoConector(String descripcion) {
        this.descripcion = descripcion;
    }
    
    public String getDescripcion() {
        return descripcion;
    }
} 
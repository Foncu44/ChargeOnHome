package com.chargeonhome.backend.model;

import javax.persistence.*;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservas")
public class Reserva {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "La fecha de inicio es obligatoria")
    @Column(name = "fecha_inicio", nullable = false)
    private LocalDateTime fechaInicio;
    
    @NotNull(message = "La fecha de fin es obligatoria")
    @Column(name = "fecha_fin", nullable = false)
    private LocalDateTime fechaFin;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoReserva estado;
    
    @NotNull(message = "El precio del garaje es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio del garaje debe ser mayor a 0")
    @Column(name = "precio_garaje", nullable = false)
    private BigDecimal precioGaraje;
    
    @Column(name = "kwh_consumidos")
    private BigDecimal kwhConsumidos;
    
    @Column(name = "precio_electricidad")
    private BigDecimal precioElectricidad;
    
    @Column(name = "comision_plataforma")
    private BigDecimal comisionPlataforma;
    
    @Column(name = "precio_total")
    private BigDecimal precioTotal;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    
    @Column(name = "fecha_confirmacion")
    private LocalDateTime fechaConfirmacion;
    
    @Column(name = "fecha_cancelacion")
    private LocalDateTime fechaCancelacion;
    
    @Lob
    @Column(name = "comentarios")
    private String comentarios;
    
    @Column(name = "valoracion")
    private Integer valoracion;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "garaje_id", nullable = false)
    private Garaje garaje;
    
    // Constructores
    public Reserva() {
        this.fechaCreacion = LocalDateTime.now();
        this.estado = EstadoReserva.PENDIENTE;
    }
    
    // Método para calcular el precio total
    public void calcularPrecioTotal() {
        BigDecimal total = precioGaraje != null ? precioGaraje : BigDecimal.ZERO;
        
        if (precioElectricidad != null) {
            total = total.add(precioElectricidad);
        }
        
        // Calcular comisión del 20%
        this.comisionPlataforma = total.multiply(new BigDecimal("0.20"));
        this.precioTotal = total.add(comisionPlataforma);
    }
    
    // Getters y Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public LocalDateTime getFechaInicio() {
        return fechaInicio;
    }
    
    public void setFechaInicio(LocalDateTime fechaInicio) {
        this.fechaInicio = fechaInicio;
    }
    
    public LocalDateTime getFechaFin() {
        return fechaFin;
    }
    
    public void setFechaFin(LocalDateTime fechaFin) {
        this.fechaFin = fechaFin;
    }
    
    public EstadoReserva getEstado() {
        return estado;
    }
    
    public void setEstado(EstadoReserva estado) {
        this.estado = estado;
    }
    
    public BigDecimal getPrecioGaraje() {
        return precioGaraje;
    }
    
    public void setPrecioGaraje(BigDecimal precioGaraje) {
        this.precioGaraje = precioGaraje;
    }
    
    public BigDecimal getKwhConsumidos() {
        return kwhConsumidos;
    }
    
    public void setKwhConsumidos(BigDecimal kwhConsumidos) {
        this.kwhConsumidos = kwhConsumidos;
    }
    
    public BigDecimal getPrecioElectricidad() {
        return precioElectricidad;
    }
    
    public void setPrecioElectricidad(BigDecimal precioElectricidad) {
        this.precioElectricidad = precioElectricidad;
    }
    
    public BigDecimal getComisionPlataforma() {
        return comisionPlataforma;
    }
    
    public void setComisionPlataforma(BigDecimal comisionPlataforma) {
        this.comisionPlataforma = comisionPlataforma;
    }
    
    public BigDecimal getPrecioTotal() {
        return precioTotal;
    }
    
    public void setPrecioTotal(BigDecimal precioTotal) {
        this.precioTotal = precioTotal;
    }
    
    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }
    
    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
    
    public LocalDateTime getFechaConfirmacion() {
        return fechaConfirmacion;
    }
    
    public void setFechaConfirmacion(LocalDateTime fechaConfirmacion) {
        this.fechaConfirmacion = fechaConfirmacion;
    }
    
    public LocalDateTime getFechaCancelacion() {
        return fechaCancelacion;
    }
    
    public void setFechaCancelacion(LocalDateTime fechaCancelacion) {
        this.fechaCancelacion = fechaCancelacion;
    }
    
    public String getComentarios() {
        return comentarios;
    }
    
    public void setComentarios(String comentarios) {
        this.comentarios = comentarios;
    }
    
    public Integer getValoracion() {
        return valoracion;
    }
    
    public void setValoracion(Integer valoracion) {
        this.valoracion = valoracion;
    }
    
    public Usuario getUsuario() {
        return usuario;
    }
    
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    
    public Garaje getGaraje() {
        return garaje;
    }
    
    public void setGaraje(Garaje garaje) {
        this.garaje = garaje;
    }
} 
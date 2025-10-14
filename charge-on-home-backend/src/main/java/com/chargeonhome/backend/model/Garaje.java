package com.chargeonhome.backend.model;

import javax.persistence.*;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "garajes")
public class Garaje {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "La dirección es obligatoria")
    @Column(nullable = false)
    private String direccion;
    
    @NotNull(message = "La latitud es obligatoria")
    @Column(nullable = false)
    private Double latitud;
    
    @NotNull(message = "La longitud es obligatoria")
    @Column(nullable = false)
    private Double longitud;
    
    @NotNull(message = "El ancho es obligatorio")
    @DecimalMin(value = "0.1", message = "El ancho debe ser mayor a 0")
    @Column(nullable = false)
    private BigDecimal ancho;
    
    @NotNull(message = "El largo es obligatorio")
    @DecimalMin(value = "0.1", message = "El largo debe ser mayor a 0")
    @Column(nullable = false)
    private BigDecimal largo;
    
    @NotNull(message = "La altura es obligatoria")
    @DecimalMin(value = "0.1", message = "La altura debe ser mayor a 0")
    @Column(nullable = false)
    private BigDecimal altura;
    
    @NotNull(message = "El precio por hora es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
    @Column(name = "precio_hora", nullable = false)
    private BigDecimal precioHora;
    
    @NotNull(message = "El precio por kWh es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio por kWh debe ser mayor a 0")
    @Column(name = "precio_kwh", nullable = false)
    private BigDecimal precioKwh;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_conector", nullable = false)
    private TipoConector tipoConector;
    
    @NotNull(message = "La potencia de carga es obligatoria")
    @DecimalMin(value = "1", message = "La potencia debe ser mayor a 0")
    @Column(name = "potencia_carga", nullable = false)
    private BigDecimal potenciaCarga;
    
    @Column(name = "hora_inicio")
    private LocalTime horaInicio;
    
    @Column(name = "hora_fin")
    private LocalTime horaFin;
    
    @Column(name = "disponible_24h")
    private Boolean disponible24h = false;
    
    @Column(name = "activo")
    private Boolean activo = true;
    
    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;
    
    @Lob
    @Column(name = "descripcion")
    private String descripcion;
    
    @ElementCollection
    @CollectionTable(name = "garaje_fotos", joinColumns = @JoinColumn(name = "garaje_id"))
    @Column(name = "url_foto")
    private List<String> fotos;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "propietario_id", nullable = false)
    private Usuario propietario;
    
    @OneToMany(mappedBy = "garaje", cascade = CascadeType.ALL)
    private List<Reserva> reservas;
    
    // Constructores
    public Garaje() {
        this.fechaRegistro = LocalDateTime.now();
    }
    
    // Getters y Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getDireccion() {
        return direccion;
    }
    
    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
    
    public Double getLatitud() {
        return latitud;
    }
    
    public void setLatitud(Double latitud) {
        this.latitud = latitud;
    }
    
    public Double getLongitud() {
        return longitud;
    }
    
    public void setLongitud(Double longitud) {
        this.longitud = longitud;
    }
    
    public BigDecimal getAncho() {
        return ancho;
    }
    
    public void setAncho(BigDecimal ancho) {
        this.ancho = ancho;
    }
    
    public BigDecimal getLargo() {
        return largo;
    }
    
    public void setLargo(BigDecimal largo) {
        this.largo = largo;
    }
    
    public BigDecimal getAltura() {
        return altura;
    }
    
    public void setAltura(BigDecimal altura) {
        this.altura = altura;
    }
    
    public BigDecimal getPrecioHora() {
        return precioHora;
    }
    
    public void setPrecioHora(BigDecimal precioHora) {
        this.precioHora = precioHora;
    }
    
    public BigDecimal getPrecioKwh() {
        return precioKwh;
    }
    
    public void setPrecioKwh(BigDecimal precioKwh) {
        this.precioKwh = precioKwh;
    }
    
    public TipoConector getTipoConector() {
        return tipoConector;
    }
    
    public void setTipoConector(TipoConector tipoConector) {
        this.tipoConector = tipoConector;
    }
    
    public BigDecimal getPotenciaCarga() {
        return potenciaCarga;
    }
    
    public void setPotenciaCarga(BigDecimal potenciaCarga) {
        this.potenciaCarga = potenciaCarga;
    }
    
    public LocalTime getHoraInicio() {
        return horaInicio;
    }
    
    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }
    
    public LocalTime getHoraFin() {
        return horaFin;
    }
    
    public void setHoraFin(LocalTime horaFin) {
        this.horaFin = horaFin;
    }
    
    public Boolean getDisponible24h() {
        return disponible24h;
    }
    
    public void setDisponible24h(Boolean disponible24h) {
        this.disponible24h = disponible24h;
    }
    
    public Boolean getActivo() {
        return activo;
    }
    
    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
    
    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }
    
    public void setFechaRegistro(LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }
    
    public String getDescripcion() {
        return descripcion;
    }
    
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    
    public List<String> getFotos() {
        return fotos;
    }
    
    public void setFotos(List<String> fotos) {
        this.fotos = fotos;
    }
    
    public Usuario getPropietario() {
        return propietario;
    }
    
    public void setPropietario(Usuario propietario) {
        this.propietario = propietario;
    }
    
    public List<Reserva> getReservas() {
        return reservas;
    }
    
    public void setReservas(List<Reserva> reservas) {
        this.reservas = reservas;
    }
} 
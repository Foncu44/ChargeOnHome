import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

// Angular Material imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { GoogleMapsModule } from '@angular/google-maps';

// Services and models
import { AuthService } from '../../services/auth.service';
import { GarajeService } from '../../services/garaje.service';
import { ReservaService } from '../../services/reserva.service';
import { Garaje, TipoConector } from '../../models/garaje.interface';
import { ReservaRequest, CalculoPrecioResponse, EstadoReserva } from '../../models/reserva.interface';
import { Usuario } from '../../models/usuario.interface';

@Component({
  selector: 'app-detalle-garaje',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTabsModule,
    MatChipsModule,
    GoogleMapsModule
  ],
  templateUrl: './detalle-garaje.component.html',
  styleUrl: './detalle-garaje.component.scss'
})
export class DetalleGarajeComponent implements OnInit {
  garaje: Garaje | null = null;
  currentUser$: Observable<Usuario | null>;
  isLoading = false;
  reservaForm!: FormGroup;
  calculoPrecio: CalculoPrecioResponse | null = null;
  fotoActual = 0;
  
  // Configuración del mapa
  center: google.maps.LatLngLiteral = { lat: 40.4168, lng: -3.7038 };
  zoom = 15;
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
  };
  markerPosition: google.maps.LatLngLiteral | null = null;

  tiposConector = [
    { value: TipoConector.TIPO_1, label: 'Tipo 1 (SAE J1772)' },
    { value: TipoConector.TIPO_2, label: 'Tipo 2 (Mennekes)' },
    { value: TipoConector.CCS_COMBO_1, label: 'CCS Combo 1' },
    { value: TipoConector.CCS_COMBO_2, label: 'CCS Combo 2' },
    { value: TipoConector.CHADEMO, label: 'CHAdeMO' },
    { value: TipoConector.TESLA_SUPERCHARGER, label: 'Tesla Supercharger' },
    { value: TipoConector.SCHUKO, label: 'Schuko' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private garajeService: GarajeService,
    private reservaService: ReservaService,
    private snackBar: MatSnackBar
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.initializeReservaForm();
  }

  ngOnInit(): void {
    const garajeId = this.route.snapshot.paramMap.get('id');
    if (garajeId) {
      this.cargarGaraje(+garajeId);
    }
  }

  private initializeReservaForm(): void {
    this.reservaForm = this.fb.group({
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]]
    });
  }

  private cargarGaraje(id: number): void {
    this.isLoading = true;
    
    // Simulación - cuando el backend esté listo, usar:
    // this.garajeService.obtenerGarajePorId(id).subscribe({...})
    
    // Datos de ejemplo - buscar el garaje por ID
    const garajesEjemplo = [
      {
        id: 1,
        propietarioId: 1,
        direccion: 'Calle Gran Vía 28, Madrid',
        latitud: 40.4194,
        longitud: -3.7040,
        ancho: 2.5,
        largo: 5.0,
        altura: 2.2,
        precioPorHora: 8.50,
        precioElectricidad: 0.25,
        tipoConector: TipoConector.TIPO_2,
        potenciaCarga: 11,
        disponible24h: true,
        descripcion: 'Garaje céntrico en el corazón de Madrid, muy fácil acceso y seguro. Perfecto para cargar tu vehículo eléctrico mientras disfrutas del centro de la ciudad.',
        fotos: ['/assets/images/garage-placeholder.svg'],
        activo: true,
        fechaCreacion: new Date()
      },
      {
        id: 2,
        propietarioId: 2,
        direccion: 'Avenida Diagonal 123, Barcelona',
        latitud: 41.3936,
        longitud: 2.1589,
        ancho: 2.8,
        largo: 5.5,
        altura: 2.5,
        precioPorHora: 12.00,
        precioElectricidad: 0.30,
        tipoConector: TipoConector.CCS_COMBO_2,
        potenciaCarga: 22,
        disponible24h: false,
        descripcion: 'Garaje moderno con carga rápida, ideal para estancias cortas. Ubicado en una de las avenidas más importantes de Barcelona.',
        fotos: ['/assets/images/garage-placeholder.svg'],
        activo: true,
        fechaCreacion: new Date()
      },
      {
        id: 3,
        propietarioId: 3,
        direccion: 'Calle Alcalá 456, Madrid',
        latitud: 40.4300,
        longitud: -3.6700,
        ancho: 2.3,
        largo: 4.8,
        altura: 2.0,
        precioPorHora: 6.75,
        precioElectricidad: 0.22,
        tipoConector: TipoConector.SCHUKO,
        potenciaCarga: 3.7,
        disponible24h: true,
        descripcion: 'Opción económica para cargas lentas durante la noche. Perfecto para usuarios que necesitan cargar durante varias horas.',
        fotos: ['/assets/images/garage-placeholder.svg'],
        activo: true,
        fechaCreacion: new Date()
      }
    ];
    
    setTimeout(() => {
      const garajeEncontrado = garajesEjemplo.find(g => g.id === id);
      
      if (garajeEncontrado) {
        this.garaje = garajeEncontrado;
      } else {
        // Fallback al primer garaje si no se encuentra
        this.garaje = garajesEjemplo[0];
      }
      
      if (this.garaje) {
        this.center = { lat: this.garaje.latitud, lng: this.garaje.longitud };
        this.markerPosition = this.center;
      }
      this.isLoading = false;
    }, 500);
  }

  getTipoConectorLabel(tipo: TipoConector): string {
    const tipoObj = this.tiposConector.find(t => t.value === tipo);
    return tipoObj ? tipoObj.label : tipo;
  }

  calcularArea(): number {
    if (!this.garaje) return 0;
    return this.garaje.ancho * this.garaje.largo;
  }

  calcularPrecio(): void {
    if (this.reservaForm.valid && this.garaje) {
      const fechaInicio = new Date(this.reservaForm.value.fechaInicio);
      const fechaFin = new Date(this.reservaForm.value.fechaFin);
      
      if (fechaFin <= fechaInicio) {
        this.snackBar.open('La fecha de fin debe ser posterior a la de inicio', 'Cerrar', {
          duration: 3000
        });
        return;
      }

      this.reservaService.calcularPrecio(this.garaje.id!, fechaInicio, fechaFin).subscribe({
        next: (calculo) => {
          this.calculoPrecio = calculo;
        },
        error: (error) => {
          console.error('Error al calcular precio:', error);
          // Calcular localmente como fallback
          this.calcularPrecioLocal(fechaInicio, fechaFin);
        }
      });
    }
  }

  private calcularPrecioLocal(fechaInicio: Date, fechaFin: Date): void {
    if (!this.garaje) return;
    
    const horas = (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60);
    const precioGaraje = horas * this.garaje.precioPorHora;
    const precioElectricidad = horas * this.garaje.precioElectricidad * this.garaje.potenciaCarga;
    const comisionPlataforma = (precioGaraje + precioElectricidad) * 0.20;
    const precioTotal = precioGaraje + precioElectricidad + comisionPlataforma;

    this.calculoPrecio = {
      precioGaraje,
      precioElectricidad,
      comisionPlataforma,
      precioTotal,
      horas
    };
  }

  crearReserva(): void {
    if (this.reservaForm.valid && this.garaje && this.calculoPrecio) {
      const reservaData: ReservaRequest = {
        garajeId: this.garaje.id!,
        fechaInicio: new Date(this.reservaForm.value.fechaInicio),
        fechaFin: new Date(this.reservaForm.value.fechaFin)
      };

      this.reservaService.crearReserva(reservaData).subscribe({
        next: (reserva) => {
          this.snackBar.open('Reserva creada exitosamente', 'Cerrar', {
            duration: 3000
          });
          this.router.navigate(['/perfil']);
        },
        error: (error) => {
          console.error('Error al crear reserva:', error);
          this.snackBar.open('Error al crear la reserva. Intenta nuevamente.', 'Cerrar', {
            duration: 5000
          });
        }
      });
    }
  }

  siguienteFoto(): void {
    if (this.garaje && this.garaje.fotos.length > 0) {
      this.fotoActual = (this.fotoActual + 1) % this.garaje.fotos.length;
    }
  }

  anteriorFoto(): void {
    if (this.garaje && this.garaje.fotos.length > 0) {
      this.fotoActual = (this.fotoActual - 1 + this.garaje.fotos.length) % this.garaje.fotos.length;
    }
  }

  esPropietario(): Observable<boolean> {
    return new Observable(observer => {
      this.currentUser$.subscribe(user => {
        observer.next(user !== null && this.garaje !== null && user.id === this.garaje.propietarioId);
        observer.complete();
      });
    });
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

// Angular Material imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { GoogleMapsModule } from '@angular/google-maps';

// Services and models
import { AuthService } from '../../services/auth.service';
import { GarajeService } from '../../services/garaje.service';
import { TipoConector, GarajeRequest } from '../../models/garaje.interface';
import { Usuario } from '../../models/usuario.interface';

@Component({
  selector: 'app-registrar-garaje',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    GoogleMapsModule
  ],
  templateUrl: './registrar-garaje.component.html',
  styleUrl: './registrar-garaje.component.scss'
})
export class RegistrarGarajeComponent implements OnInit {
  garajeForm!: FormGroup;
  currentUser$: Observable<Usuario | null>;
  isLoading = false;
  fotosSeleccionadas: File[] = [];
  fotosPreview: string[] = [];
  
  // Configuración del mapa
  center: google.maps.LatLngLiteral = { lat: 40.4168, lng: -3.7038 }; // Madrid por defecto
  zoom = 12;
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    maxZoom: 20,
    minZoom: 5,
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
    private fb: FormBuilder,
    private authService: AuthService,
    private garajeService: GarajeService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.initializeForm();
  }

  ngOnInit(): void {
    // Obtener ubicación actual del usuario si está disponible
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.markerPosition = this.center;
          this.zoom = 15;
        },
        () => {
          // Si falla, usar Madrid por defecto
          this.markerPosition = this.center;
        }
      );
    } else {
      this.markerPosition = this.center;
    }
  }

  private initializeForm(): void {
    this.garajeForm = this.fb.group({
      direccion: ['', [Validators.required, Validators.maxLength(500)]],
      latitud: [40.4168, [Validators.required]],
      longitud: [-3.7038, [Validators.required]],
      ancho: [2.5, [Validators.required, Validators.min(1), Validators.max(10)]],
      largo: [5.0, [Validators.required, Validators.min(1), Validators.max(20)]],
      altura: [2.2, [Validators.required, Validators.min(1.5), Validators.max(5)]],
      precioPorHora: [8.50, [Validators.required, Validators.min(0.01)]],
      precioElectricidad: [0.25, [Validators.required, Validators.min(0.01)]],
      tipoConector: ['', [Validators.required]],
      potenciaCarga: [11, [Validators.required, Validators.min(3.7)]],
      disponible24h: [true],
      horarioInicio: [''],
      horarioFin: [''],
      descripcion: ['', [Validators.maxLength(1000)]]
    });
  }

  onMapClick(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      const position = event.latLng.toJSON();
      this.markerPosition = position;
      this.garajeForm.patchValue({
        latitud: position.lat,
        longitud: position.lng
      });
      
      // Intentar obtener la dirección usando geocodificación inversa
      this.obtenerDireccionDesdeCoordenadas(position.lat, position.lng);
    }
  }

  private obtenerDireccionDesdeCoordenadas(lat: number, lng: number): void {
    // En producción, usarías el servicio de geocodificación de Google Maps
    // Por ahora, solo actualizamos las coordenadas
    console.log('Coordenadas seleccionadas:', lat, lng);
  }

  onFotosSeleccionadas(event: any): void {
    const files = Array.from(event.target.files) as File[];
    if (files.length > 0) {
      this.fotosSeleccionadas = [...this.fotosSeleccionadas, ...files].slice(0, 10); // Máximo 10 fotos
      
      // Crear previews
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.fotosPreview.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  eliminarFoto(index: number): void {
    this.fotosSeleccionadas.splice(index, 1);
    this.fotosPreview.splice(index, 1);
  }

  onSubmit(): void {
    if (this.garajeForm.valid && this.markerPosition) {
      this.isLoading = true;
      
      const garajeData: GarajeRequest = {
        ...this.garajeForm.value,
        latitud: this.markerPosition.lat,
        longitud: this.markerPosition.lng
      };

      // Si no está disponible 24h, validar horarios
      if (!garajeData.disponible24h && (!garajeData.horarioInicio || !garajeData.horarioFin)) {
        this.snackBar.open('Debes especificar horarios si no está disponible 24h', 'Cerrar', {
          duration: 3000
        });
        this.isLoading = false;
        return;
      }

      // Crear el garaje
      this.garajeService.crearGaraje(garajeData as any).subscribe({
        next: (garaje) => {
          // Si hay fotos, subirlas
          if (this.fotosSeleccionadas.length > 0) {
            this.garajeService.subirFotos(garaje.id!, this.fotosSeleccionadas).subscribe({
              next: () => {
                this.snackBar.open('Garaje registrado exitosamente', 'Cerrar', {
                  duration: 3000
                });
                this.router.navigate(['/garaje', garaje.id]);
              },
              error: (error) => {
                console.error('Error al subir fotos:', error);
                this.snackBar.open('Garaje creado pero hubo un error al subir las fotos', 'Cerrar', {
                  duration: 5000
                });
                this.router.navigate(['/garaje', garaje.id]);
              }
            });
          } else {
            this.snackBar.open('Garaje registrado exitosamente', 'Cerrar', {
              duration: 3000
            });
            this.router.navigate(['/garaje', garaje.id]);
          }
        },
        error: (error) => {
          console.error('Error al registrar garaje:', error);
          this.snackBar.open('Error al registrar el garaje. Intenta nuevamente.', 'Cerrar', {
            duration: 5000
          });
          this.isLoading = false;
        }
      });
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.garajeForm.controls).forEach(key => {
        this.garajeForm.get(key)?.markAsTouched();
      });
      
      if (!this.markerPosition) {
        this.snackBar.open('Debes seleccionar una ubicación en el mapa', 'Cerrar', {
          duration: 3000
        });
      }
    }
  }

  getTipoConectorLabel(tipo: TipoConector): string {
    const tipoObj = this.tiposConector.find(t => t.value === tipo);
    return tipoObj ? tipoObj.label : tipo;
  }

  calcularArea(): number {
    const ancho = this.garajeForm.get('ancho')?.value || 0;
    const largo = this.garajeForm.get('largo')?.value || 0;
    return ancho * largo;
  }
}

import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

// Angular Material imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
// MatFabModule no existe, usamos MatButtonModule que incluye FAB

// Google Maps
import { GoogleMapsModule } from '@angular/google-maps';

// Mobile Navigation
import { MobileNavigationComponent } from '../mobile-navigation/mobile-navigation.component';

// Services and models
import { AuthService } from '../../services/auth.service';
import { GarajeService } from '../../services/garaje.service';
import { PlatformService } from '../../utils/platform.util';
import { Usuario } from '../../models/usuario.interface';
import { Garaje, TipoConector, FiltrosGaraje } from '../../models/garaje.interface';

// Interfaz para marcadores personalizados
interface MarcadorPersonalizado {
  position: google.maps.LatLngLiteral;
  title: string;
  icon?: any;
}

@Component({
  selector: 'app-mapa-garajes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    GoogleMapsModule,
    MobileNavigationComponent
  ] as any[],
  templateUrl: './mapa-garajes.component.html',
  styleUrls: ['./mapa-garajes.component.scss']
})
export class MapaGarajesComponent implements OnInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  @ViewChild('sidenav') sidenav!: any;

  filtrosForm!: FormGroup;
  garajes: Garaje[] = [];
  currentUser$: Observable<Usuario | null>;
  isLoading = false;
  vistaActual: 'list' | 'grid' | 'map' = 'list';
  isMobile = false;
  selectedGaraje: Garaje | null = null; // Para almacenar el garaje seleccionado del mapa
  showMapOverlay = false; // Para controlar si mostrar la tarjeta superpuesta

  // Configuración del mapa
  center: google.maps.LatLngLiteral = { lat: 40.4168, lng: -3.7038 }; // Madrid
  zoom = 10;
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    maxZoom: 20,
    minZoom: 5,
  };

  // Marcadores del mapa
  marcadores: MarcadorPersonalizado[] = [];

  // Datos de ejemplo para desarrollo
  garajesEjemplo: Garaje[] = [
    {
      id: 1,
      propietarioId: 1,
      direccion: 'Calle Gran Vía 28, Madrid',
      latitud: 40.4168,
      longitud: -3.7038,
      ancho: 2.5,
      largo: 5.0,
      altura: 2.2,
      precioPorHora: 8.50,
      precioElectricidad: 0.25,
      tipoConector: TipoConector.TIPO_2,
      potenciaCarga: 11,
      disponible24h: true,
      descripcion: 'Garaje céntrico en el corazón de Madrid, muy fácil acceso y seguro.',
      fotos: ['/assets/images/garage1.jpg'],
      activo: true,
      fechaCreacion: new Date()
    },
    {
      id: 2,
      propietarioId: 2,
      direccion: 'Avenida Diagonal 123, Barcelona',
      latitud: 41.3851,
      longitud: 2.1734,
      ancho: 2.8,
      largo: 5.5,
      altura: 2.5,
      precioPorHora: 12.00,
      precioElectricidad: 0.30,
      tipoConector: TipoConector.CCS_COMBO_2,
      potenciaCarga: 22,
      disponible24h: false,
      descripcion: 'Garaje moderno con carga rápida, ideal para estancias cortas.',
      fotos: ['/assets/images/garage2.jpg'],
      activo: true,
      fechaCreacion: new Date()
    },
    {
      id: 3,
      propietarioId: 3,
      direccion: 'Calle Alcalá 456, Madrid',
      latitud: 40.4200,
      longitud: -3.6900,
      ancho: 2.3,
      largo: 4.8,
      altura: 2.0,
      precioPorHora: 6.75,
      precioElectricidad: 0.22,
      tipoConector: TipoConector.SCHUKO,
      potenciaCarga: 3.7,
      disponible24h: true,
      descripcion: 'Opción económica para cargas lentas durante la noche.',
      fotos: ['/assets/images/garage3.jpg'],
      activo: true,
      fechaCreacion: new Date()
    }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private garajeService: GarajeService,
    private platformService: PlatformService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.initializeForm();
  }

  ngOnInit(): void {
    this.checkMobile();
    this.cargarGarajes();
    this.initializeMap();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    // Solo ejecutar si estamos en el navegador
    if (typeof window !== 'undefined') {
      this.checkMobile();
    }
  }

  private checkMobile(): void {
    // Verificar si estamos en el navegador (no en SSR)
    if (typeof window !== 'undefined') {
      this.isMobile = window.innerWidth <= 768;
    } else {
      this.isMobile = false; // Default para SSR
    }
  }

  // Método para cerrar el sidenav en móvil
  closeSidenav(): void {
    if (this.isMobile && this.sidenav) {
      this.sidenav.close();
    }
  }

  // Método para forzar el cierre del sidenav
  forceCloseSidenav(): void {
    if (this.sidenav) {
      this.sidenav.close();
      // Forzar el cierre también a nivel de DOM
      setTimeout(() => {
        const sidenavElement = document.querySelector('mat-sidenav');
        if (sidenavElement) {
          sidenavElement.classList.remove('mat-drawer-opened');
        }
      }, 100);
    }
  }

  private initializeForm(): void {
    this.filtrosForm = this.fb.group({
      ubicacion: [''],
      radio: [10],
      tipoConector: [''],
      potenciaMinima: [''],
      precioMaximo: [''],
      disponible24h: [false],
      fechaInicio: [''],
      fechaFin: ['']
    });
  }

  private cargarGarajes(): void {
    this.isLoading = true;
    
    // Simulamos una llamada a la API
    setTimeout(() => {
      this.garajes = [...this.garajesEjemplo];
      // Solo crear marcadores si Google Maps está disponible
      if (typeof google !== 'undefined' && google.maps) {
        this.crearMarcadores();
      }
      this.isLoading = false;
    }, 1000);

    // Cuando el backend esté listo, usar esto:
    /*
    this.garajeService.obtenerGarajes().subscribe({
      next: (garajes) => {
        this.garajes = garajes;
        if (typeof google !== 'undefined' && google.maps) {
          this.crearMarcadores();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar garajes:', error);
        this.isLoading = false;
      }
    });
    */
  }

  private esperarGoogleMapsYCrearMarcadores(): void {
    // Verificar si estamos en el navegador (no en SSR)
    if (this.platformService.isServer()) {
      console.log('Ejecutando en SSR, omitiendo Google Maps');
      return;
    }

    // Eliminar el bucle infinito - solo intentar una vez
    if (typeof google !== 'undefined' && google.maps) {
      this.crearMarcadores();
    } else {
      console.log('Google Maps no disponible, mostrando solo la lista de garajes');
    }
  }

  private crearMarcadores(): void {
    // Verificar si Google Maps está disponible
    if (typeof google === 'undefined' || !google.maps) {
      console.log('Google Maps no disponible para crear marcadores');
      return;
    }

    this.marcadores = this.garajes.map(garaje => ({
      position: { lat: garaje.latitud, lng: garaje.longitud },
      title: `${garaje.direccion} - ${garaje.precioPorHora}€/h - ${garaje.potenciaCarga}kW`,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="#4CAF50" stroke="#2E7D32" stroke-width="2"/>
            <circle cx="20" cy="20" r="14" fill="#66BB6A"/>
            <path d="M16 12l8 8h-5v8l-8-8h5v-8z" fill="#FFFFFF" stroke="#2E7D32" stroke-width="1"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 20)
      }
    }));

    console.log('Marcadores creados exitosamente:', this.marcadores.length);

    // Ajustar el centro del mapa si hay garajes
    if (this.garajes.length > 0) {
      // Centrar en Madrid por defecto pero mostrar todos los marcadores
      this.center = { lat: 40.4168, lng: -3.7038 };
      this.zoom = 6; // Zoom más amplio para ver toda España
    }
  }

  onMapClick(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      console.log('Clicked on map:', event.latLng.toJSON());
    }
  }


  private scrollToGaraje(index: number): void {
    // Verificar si estamos en el navegador (no en SSR)
    if (this.platformService.isServer()) {
      return;
    }

    const document = this.platformService.getDocument();
    if (!document) {
      return;
    }

    const garajeCards = document.querySelectorAll('.garaje-card');
    if (garajeCards[index]) {
      garajeCards[index].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      // Highlight temporal del garaje
      garajeCards[index].classList.add('highlighted');
      setTimeout(() => {
        garajeCards[index].classList.remove('highlighted');
      }, 2000);
    }
  }

  aplicarFiltros(): void {
    // Cerrar sidenav inmediatamente en móvil
    if (this.isMobile) {
      this.forceCloseSidenav();
    }
    
    if (this.filtrosForm.valid) {
      this.isLoading = true;
      
      const filtros: FiltrosGaraje = {
        ubicacion: this.filtrosForm.value.ubicacion || undefined,
        radio: this.filtrosForm.value.radio,
        tipoConector: this.filtrosForm.value.tipoConector || undefined,
        potenciaMinima: this.filtrosForm.value.potenciaMinima || undefined,
        precioMaximo: this.filtrosForm.value.precioMaximo || undefined,
        disponible24h: this.filtrosForm.value.disponible24h || undefined,
        fechaInicio: this.filtrosForm.value.fechaInicio || undefined,
        fechaFin: this.filtrosForm.value.fechaFin || undefined
      };

      // Simulamos filtrado local por ahora
      setTimeout(() => {
        this.garajes = this.garajesEjemplo.filter(garaje => {
          if (filtros.tipoConector && garaje.tipoConector !== filtros.tipoConector) {
            return false;
          }
          if (filtros.potenciaMinima && garaje.potenciaCarga < filtros.potenciaMinima) {
            return false;
          }
          if (filtros.precioMaximo && garaje.precioPorHora > filtros.precioMaximo) {
            return false;
          }
          if (filtros.disponible24h && !garaje.disponible24h) {
            return false;
          }
          return true;
        });
        this.esperarGoogleMapsYCrearMarcadores();
        this.isLoading = false;
        // Cerrar filtros en móvil después de aplicar
        if (this.isMobile) {
          this.forceCloseSidenav();
        }
      }, 500);

      // Cuando el backend esté listo:
      /*
      this.garajeService.obtenerGarajes(filtros).subscribe({
        next: (garajes) => {
          this.garajes = garajes;
          this.esperarGoogleMapsYCrearMarcadores();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al buscar garajes:', error);
          this.isLoading = false;
        }
      });
      */
    }
  }

  limpiarFiltros(): void {
    this.filtrosForm.reset({
      ubicacion: '',
      radio: 10,
      tipoConector: '',
      potenciaMinima: '',
      precioMaximo: '',
      disponible24h: false,
      fechaInicio: '',
      fechaFin: ''
    });
    this.cargarGarajes();
  }

  cambiarVista(event: any): void {
    this.vistaActual = event.value;
    console.log('Vista cambiada a:', this.vistaActual);
  }

  verDetalleGaraje(garajeId: number): void {
    this.router.navigate(['/garaje', garajeId]);
  }

  getTipoConectorLabel(tipo: TipoConector): string {
    const labels: { [key in TipoConector]: string } = {
      [TipoConector.TIPO_1]: 'Tipo 1',
      [TipoConector.TIPO_2]: 'Tipo 2',
      [TipoConector.CCS_COMBO_1]: 'CCS Combo 1',
      [TipoConector.CCS_COMBO_2]: 'CCS Combo 2',
      [TipoConector.CHADEMO]: 'CHAdeMO',
      [TipoConector.TESLA_SUPERCHARGER]: 'Tesla',
      [TipoConector.SCHUKO]: 'Schuko'
    };
    return labels[tipo] || tipo;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private initializeMap(): void {
    // Verificar si estamos en el navegador (no en SSR)
    if (this.platformService.isServer()) {
      console.log('Ejecutando en SSR, omitiendo inicialización de Google Maps');
      return;
    }

    // Verificar si Google Maps ya está cargado
    if (typeof google !== 'undefined' && google.maps) {
      console.log('Google Maps ya estaba cargado');
      this.crearMarcadoresSiEsPosible();
      return;
    }

    // Verificar si Google Maps se carga usando el callback
    const checkGoogleMaps = () => {
      const window = this.platformService.getWindow();
      if (window && (window as any).googleMapsLoaded && typeof google !== 'undefined' && google.maps) {
        console.log('Google Maps cargado via callback');
        this.crearMarcadoresSiEsPosible();
        return;
      }
      
      // Timeout después de 10 segundos
      if (Date.now() - startTime > 10000) {
        console.log('Timeout: Google Maps no se pudo cargar');
        return;
      }
      
      setTimeout(checkGoogleMaps, 500);
    };
    
    const startTime = Date.now();
    checkGoogleMaps();
  }

  private crearMarcadoresSiEsPosible(): void {
    if (this.garajes.length > 0) {
      this.crearMarcadores();
    }
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.zoom = 15;
          console.log('Ubicación actual:', this.center);
        },
        (error) => {
          console.error('Error al obtener ubicación:', error);
          // Fallback a Madrid
          this.center = { lat: 40.4168, lng: -3.7038 };
          this.zoom = 10;
        }
      );
    } else {
      console.log('Geolocalización no soportada');
      // Fallback a Madrid
      this.center = { lat: 40.4168, lng: -3.7038 };
      this.zoom = 10;
    }
  }

  toggleViewMode(): void {
    // Alternar entre vista lista+mapa y solo mapa
    if (this.vistaActual === 'list') {
      this.vistaActual = 'map';
    } else {
      this.vistaActual = 'list';
    }
    
    if (this.vistaActual === 'map') {
      this.showMapOverlay = false;
      this.selectedGaraje = null;
    }
  }

  onMarkerClick(event: any, index: number): void {
    const garaje = this.garajes[index];
    if (garaje) {
      this.selectedGaraje = garaje;
      this.showMapOverlay = true;
      this.center = { lat: garaje.latitud, lng: garaje.longitud };
      this.zoom = 15;
    }
  }

  closeMapOverlay(): void {
    this.showMapOverlay = false;
    this.selectedGaraje = null;
  }

  // Método para toggle del sidenav desde navegación móvil
  toggleSidenav(): void {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }
}

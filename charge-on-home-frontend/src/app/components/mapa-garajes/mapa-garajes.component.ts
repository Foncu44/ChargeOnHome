import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

// Angular Material imports
import { MatToolbarModule } from '@angular/material/toolbar';
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
  garajeId?: number;
}

@Component({
  selector: 'app-mapa-garajes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatToolbarModule,
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

  // Mapa para rastrear la imagen principal seleccionada de cada garaje
  selectedMainImage: Map<number, number> = new Map();
  
  // Mapa para rastrear garajes favoritos
  favoritos: Set<number> = new Set();
  
  // Set para rastrear garajes vistos (desde localStorage)
  garajesVistos: Set<number> = new Set();
  
  // Garaje seleccionado en el mapa para mostrar en tarjeta
  selectedMapGaraje: Garaje | null = null;
  showMapCard = false;

  // Datos de ejemplo para desarrollo (con coordenadas más precisas usando geocodificación)
  garajesEjemplo: Garaje[] = [
    {
      id: 1,
      propietarioId: 1,
      direccion: 'Calle Gran Vía 28, Madrid',
      latitud: 40.4194, // Coordenadas para Gran Vía 28, Madrid (centro)
      longitud: -3.7040,
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
      latitud: 41.3936, // Coordenadas aproximadas para Diagonal 123, Barcelona
      longitud: 2.1589,
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
      latitud: 40.4300, // Coordenadas para Alcalá 456, Madrid (zona de Ventas)
      longitud: -3.6700,
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
    this.cargarGarajesVistos();
    this.cargarGarajes();
    this.initializeMap();
  }
  
  private cargarGarajesVistos(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const vistos = localStorage.getItem('garajesVistos');
      if (vistos) {
        try {
          const ids = JSON.parse(vistos) as number[];
          this.garajesVistos = new Set(ids);
        } catch (e) {
          console.error('Error al cargar garajes vistos:', e);
        }
      }
    }
  }
  
  private guardarGarajeVisto(garajeId: number): void {
    this.garajesVistos.add(garajeId);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('garajesVistos', JSON.stringify(Array.from(this.garajesVistos)));
    }
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

  get ubicacionControl(): FormControl {
    return this.filtrosForm.get('ubicacion') as FormControl;
  }

  private cargarGarajes(): void {
    this.isLoading = true;

    // Simulamos una llamada a la API
    setTimeout(() => {
      this.garajes = [...this.garajesEjemplo];
      // Inicializar imagen principal para cada garaje (primera imagen por defecto)
      this.garajes.forEach(garaje => {
        if (garaje.id && !this.selectedMainImage.has(garaje.id)) {
          this.selectedMainImage.set(garaje.id, 0);
        }
      });
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

    this.marcadores = this.garajes.map(garaje => {
      if (!garaje.id) {
        console.warn('Garaje sin ID:', garaje);
        return null;
      }
      
      const isViewed = this.garajesVistos.has(garaje.id);
      const iconOptions = this.getMarkerIconOptions(garaje.id);
      
      const marcador = {
        position: { lat: garaje.latitud, lng: garaje.longitud },
        title: `${garaje.direccion} - ${garaje.precioPorHora}€/h - ${garaje.potenciaCarga}kW`,
        icon: iconOptions,
        garajeId: garaje.id // Guardar el ID del garaje para referencia
      };
      
      console.log('Marcador creado:', marcador.garajeId, garaje.direccion, marcador.position);
      return marcador;
    }).filter(m => m !== null) as MarcadorPersonalizado[];

    console.log('Marcadores creados exitosamente:', this.marcadores.length);

    // Ajustar el centro del mapa si hay garajes
    if (this.garajes.length > 0) {
      // Centrar en Madrid por defecto pero mostrar todos los marcadores
      this.center = { lat: 40.4168, lng: -3.7038 };
      this.zoom = 10; // Zoom más apropiado para Madrid
    }
  }

  getMarkerOptions(marcador: MarcadorPersonalizado): google.maps.MarkerOptions {
    // Si el marcador no tiene icono, crear uno basado en si ha sido visto
    if (!marcador.icon && marcador.garajeId) {
      marcador.icon = this.getMarkerIconOptions(marcador.garajeId);
    }
    
    const baseOptions: google.maps.MarkerOptions = {
      clickable: true,
      cursor: 'pointer',
      optimized: false // Desactivar optimización para asegurar que los eventos funcionen
    };
    
    if (marcador.icon) {
      baseOptions.icon = marcador.icon;
    }
    
    return baseOptions;
  }

  getMarkerIconUrl(garajeId?: number, isViewed: boolean = false): string {
    // Morado (#9C27B0) para garajes mostrados actualmente
    // Verde oscuro (#2E7D32) para garajes ya vistos
    const color = isViewed ? '#2E7D32' : '#9C27B0';
    const strokeColor = isViewed ? '#1B5E20' : '#7B1FA2';
    
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'>
        <circle cx='20' cy='20' r='18' fill='${color}' stroke='${strokeColor}' stroke-width='2'/>
        <path d='M20 12 L20 28 M12 20 L28 20' stroke='white' stroke-width='2' stroke-linecap='round'/>
        <circle cx='20' cy='20' r='6' fill='white'/>
      </svg>
    `;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  getMarkerIconOptions(garajeId?: number): any {
    const isViewed = garajeId ? this.garajesVistos.has(garajeId) : false;
    const iconUrl = this.getMarkerIconUrl(garajeId, isViewed);
    
    if (typeof google === 'undefined' || !google.maps) {
      return {
        url: iconUrl,
        scaledSize: { width: 40, height: 40 },
        anchor: { x: 20, y: 20 }
      };
    }
    return {
      url: iconUrl,
      scaledSize: new google.maps.Size(40, 40),
      anchor: new google.maps.Point(20, 20)
    };
  }

  onMapClick(event: google.maps.MapMouseEvent): void {
    // Cerrar la tarjeta si se hace clic en el mapa (no en un marcador)
    if (this.showMapCard) {
      this.closeMapCard();
    }
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
        // Inicializar imagen principal para cada garaje filtrado
        this.garajes.forEach(garaje => {
          if (garaje.id && !this.selectedMainImage.has(garaje.id)) {
            this.selectedMainImage.set(garaje.id, 0);
          }
        });
        // Recrear marcadores con los nuevos garajes filtrados
        if (typeof google !== 'undefined' && google.maps) {
          this.crearMarcadores();
        }
        this.isLoading = false;
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
    console.log('Marcador clickeado, índice:', index);
    
    if (event && event.stopPropagation) {
      event.stopPropagation(); // Evitar que se propague el evento
    }
    
    if (index < 0 || index >= this.marcadores.length) {
      console.error('Índice de marcador inválido:', index);
      return;
    }
    
    const marcador = this.marcadores[index];
    if (!marcador) {
      console.error('Marcador no encontrado en índice:', index);
      return;
    }
    
    if (!marcador.garajeId) {
      console.error('Marcador sin garajeId:', marcador);
      return;
    }
    
    console.log('Buscando garaje con ID:', marcador.garajeId);
    const garaje = this.garajes.find(g => g.id === marcador.garajeId);
    if (!garaje) {
      console.error('Garaje no encontrado para ID:', marcador.garajeId);
      console.log('Garajes disponibles:', this.garajes.map(g => ({ id: g.id, direccion: g.direccion })));
      return;
    }
    
    console.log('Garaje seleccionado:', garaje.id, garaje.direccion);
    
    // Marcar como visto
    if (garaje.id) {
      this.guardarGarajeVisto(garaje.id);
      // Actualizar el marcador para cambiar el color
      this.actualizarMarcador(garaje.id);
    }
    
    // Mostrar tarjeta en el mapa
    this.selectedMapGaraje = { ...garaje }; // Crear copia para evitar referencias
    this.showMapCard = true;
    
    // Centrar el mapa en el garaje
    this.center = { lat: garaje.latitud, lng: garaje.longitud };
    this.zoom = 15;
  }
  
  onMarkerHover(event: any, index: number): void {
    // Opcional: cambiar el cursor o mostrar información al pasar el mouse
  }
  
  onMarkerMouseOut(event: any, index: number): void {
    // Opcional: restaurar el estado al salir del mouse
  }
  
  private actualizarMarcador(garajeId: number): void {
    const marcador = this.marcadores.find(m => m.garajeId === garajeId);
    if (marcador) {
      marcador.icon = this.getMarkerIconOptions(garajeId);
    }
  }
  
  closeMapCard(): void {
    this.showMapCard = false;
    this.selectedMapGaraje = null;
  }
  
  verDetalleDesdeMapa(garaje: Garaje): void {
    console.log('Navegando a detalles del garaje:', garaje.id, garaje.direccion);
    if (!garaje || !garaje.id) {
      console.error('Garaje inválido para navegar:', garaje);
      return;
    }
    this.closeMapCard();
    this.verDetalleGaraje(garaje.id);
  }

  closeMapOverlay(): void {
    this.showMapOverlay = false;
    this.selectedGaraje = null;
  }

  getMainImage(garaje: Garaje): string {
    if (!garaje.fotos || garaje.fotos.length === 0) {
      return '/assets/images/garage-placeholder.svg';
    }
    const selectedIndex = this.selectedMainImage.get(garaje.id!) || 0;
    return garaje.fotos[selectedIndex] || garaje.fotos[0] || '/assets/images/garage-placeholder.svg';
  }

  getThumbnails(garaje: Garaje): string[] {
    if (!garaje.fotos || garaje.fotos.length <= 1) {
      return [];
    }
    // Mostrar máximo 4 miniaturas (excluyendo la principal)
    const selectedIndex = this.selectedMainImage.get(garaje.id!) || 0;
    const thumbnails = garaje.fotos
      .map((foto, index) => ({ foto, index }))
      .filter(item => item.index !== selectedIndex)
      .map(item => item.foto);
    return thumbnails.slice(0, 4);
  }

  changeMainImage(event: Event, garaje: Garaje, thumbnailIndex: number): void {
    event.stopPropagation(); // Evitar que se active el click de la tarjeta
    
    if (!garaje.fotos || garaje.fotos.length <= 1) {
      return;
    }
    
    const selectedIndex = this.selectedMainImage.get(garaje.id!) || 0;
    // Obtener todas las fotos excepto la principal actual
    const otherPhotos = garaje.fotos
      .map((foto, index) => ({ foto, index }))
      .filter(item => item.index !== selectedIndex);
    
    if (thumbnailIndex < otherPhotos.length) {
      const newMainIndex = otherPhotos[thumbnailIndex].index;
      this.selectedMainImage.set(garaje.id!, newMainIndex);
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/images/garage-placeholder.svg';
  }

  getCurrentImageIndex(garaje: Garaje): number {
    if (!garaje.id) return 1;
    const index = this.selectedMainImage.get(garaje.id) || 0;
    return index + 1; // Mostrar 1-based index
  }

  previousImage(event: Event, garaje: Garaje): void {
    event.stopPropagation();
    if (!garaje.fotos || garaje.fotos.length <= 1 || !garaje.id) return;
    
    const currentIndex = this.selectedMainImage.get(garaje.id) || 0;
    const newIndex = currentIndex === 0 ? garaje.fotos.length - 1 : currentIndex - 1;
    this.selectedMainImage.set(garaje.id, newIndex);
  }

  nextImage(event: Event, garaje: Garaje): void {
    event.stopPropagation();
    if (!garaje.fotos || garaje.fotos.length <= 1 || !garaje.id) return;
    
    const currentIndex = this.selectedMainImage.get(garaje.id) || 0;
    const newIndex = (currentIndex + 1) % garaje.fotos.length;
    this.selectedMainImage.set(garaje.id, newIndex);
  }

  calcularArea(garaje: Garaje): number {
    return garaje.ancho * garaje.largo;
  }

  contactar(event: Event, garaje: Garaje): void {
    event.stopPropagation();
    // Navegar a detalles o abrir modal de contacto
    this.verDetalleGaraje(garaje.id!);
  }

  verTelefono(event: Event, garaje: Garaje): void {
    event.stopPropagation();
    // Aquí se podría mostrar el teléfono del propietario
    // Por ahora navegamos a detalles
    this.verDetalleGaraje(garaje.id!);
  }

  toggleFavorito(event: Event, garaje: Garaje): void {
    event.stopPropagation();
    if (!garaje.id) return;
    
    if (this.favoritos.has(garaje.id)) {
      this.favoritos.delete(garaje.id);
    } else {
      this.favoritos.add(garaje.id);
    }
  }

  isFavorito(garaje: Garaje): boolean {
    return garaje.id ? this.favoritos.has(garaje.id) : false;
  }

}

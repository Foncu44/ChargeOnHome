import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

// Angular Material imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';

// Services and models
import { AuthService } from '../../services/auth.service';
import { GarajeService } from '../../services/garaje.service';
import { ReservaService } from '../../services/reserva.service';
import { Garaje } from '../../models/garaje.interface';
import { Reserva, EstadoReserva } from '../../models/reserva.interface';
import { Usuario } from '../../models/usuario.interface';

@Component({
  selector: 'app-perfil-usuario',
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
    MatTabsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatMenuModule
  ],
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.scss'
})
export class PerfilUsuarioComponent implements OnInit {
  currentUser$: Observable<Usuario | null>;
  perfilForm!: FormGroup;
  misGarajes: Garaje[] = [];
  misReservas: Reserva[] = [];
  reservasComoPropietario: Reserva[] = [];
  isLoading = false;
  tabIndex = 0;
  EstadoReserva = EstadoReserva; // Exponer para el template

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private garajeService: GarajeService,
    private reservaService: ReservaService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.initializeForm();
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  private initializeForm(): void {
    this.perfilForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      tipoUsuario: ['']
    });

    // Cargar datos del usuario en el formulario
    this.currentUser$.subscribe(user => {
      if (user) {
        this.perfilForm.patchValue({
          nombre: user.nombre,
          apellidos: user.apellidos,
          email: user.email,
          telefono: user.telefono,
          tipoUsuario: user.tipoUsuario
        });
      }
    });
  }

  private cargarDatos(): void {
    this.isLoading = true;
    
    // Cargar garajes y reservas en paralelo
    forkJoin({
      garajes: this.garajeService.obtenerMisGarajes(),
      reservas: this.reservaService.obtenerMisReservas()
    }).subscribe({
      next: ({ garajes, reservas }) => {
        this.misGarajes = garajes;
        this.misReservas = reservas;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
        // Usar datos de ejemplo para desarrollo
        this.misGarajes = [];
        this.misReservas = [];
        this.isLoading = false;
      }
    });
  }

  guardarPerfil(): void {
    if (this.perfilForm.valid) {
      // Aquí iría la llamada al servicio para actualizar el perfil
      this.snackBar.open('Perfil actualizado exitosamente', 'Cerrar', {
        duration: 3000
      });
    }
  }

  eliminarGaraje(garajeId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este garaje?')) {
      this.garajeService.eliminarGaraje(garajeId).subscribe({
        next: () => {
          this.misGarajes = this.misGarajes.filter(g => g.id !== garajeId);
          this.snackBar.open('Garaje eliminado exitosamente', 'Cerrar', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Error al eliminar garaje:', error);
          this.snackBar.open('Error al eliminar el garaje', 'Cerrar', {
            duration: 3000
          });
        }
      });
    }
  }

  cancelarReserva(reservaId: number): void {
    if (confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      this.reservaService.cancelarReserva(reservaId).subscribe({
        next: () => {
          this.misReservas = this.misReservas.map(r => 
            r.id === reservaId ? { ...r, estado: EstadoReserva.CANCELADA } : r
          );
          this.snackBar.open('Reserva cancelada exitosamente', 'Cerrar', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Error al cancelar reserva:', error);
          this.snackBar.open('Error al cancelar la reserva', 'Cerrar', {
            duration: 3000
          });
        }
      });
    }
  }

  getEstadoLabel(estado: EstadoReserva): string {
    const labels: { [key in EstadoReserva]: string } = {
      [EstadoReserva.PENDIENTE]: 'Pendiente',
      [EstadoReserva.CONFIRMADA]: 'Confirmada',
      [EstadoReserva.EN_CURSO]: 'En Curso',
      [EstadoReserva.COMPLETADA]: 'Completada',
      [EstadoReserva.CANCELADA]: 'Cancelada',
      [EstadoReserva.NO_PRESENTADO]: 'No Presentado'
    };
    return labels[estado] || estado;
  }

  getEstadoColor(estado: EstadoReserva): string {
    const colors: { [key in EstadoReserva]: string } = {
      [EstadoReserva.PENDIENTE]: 'gray',
      [EstadoReserva.CONFIRMADA]: 'primary',
      [EstadoReserva.EN_CURSO]: 'accent',
      [EstadoReserva.COMPLETADA]: 'primary',
      [EstadoReserva.CANCELADA]: 'warn',
      [EstadoReserva.NO_PRESENTADO]: 'warn'
    };
    return colors[estado] || 'gray';
  }

  verDetalleGaraje(garajeId: number): void {
    this.router.navigate(['/garaje', garajeId]);
  }

  editarGaraje(garajeId: number): void {
    // Navegar a edición de garaje (podría ser una ruta separada o modal)
    this.router.navigate(['/garaje', garajeId, 'editar']);
  }
}

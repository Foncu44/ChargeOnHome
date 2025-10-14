import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../services/auth.service';
import { RegistroRequest, TipoUsuario } from '../../../models/usuario.interface';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  registroForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    
    // Si ya está autenticado, redirigir al mapa
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/mapa']);
    }
  }

  private initializeForm(): void {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', [Validators.required]],
      tipoUsuario: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmarPassword = control.get('confirmarPassword');

    if (password && confirmarPassword && password.value !== confirmarPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const registroData: RegistroRequest = {
        nombre: this.registroForm.value.nombre,
        apellidos: this.registroForm.value.apellidos,
        email: this.registroForm.value.email,
        password: this.registroForm.value.password,
        telefono: this.registroForm.value.telefono || undefined,
        tipoUsuario: this.registroForm.value.tipoUsuario as TipoUsuario
      };

      this.authService.registro(registroData).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Registro exitoso:', response);
          this.router.navigate(['/mapa']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error en registro:', error);
          
          if (error.status === 409) {
            this.errorMessage = 'Ya existe una cuenta con este email';
          } else if (error.status === 400) {
            this.errorMessage = 'Datos inválidos. Verifica la información introducida.';
          } else if (error.status === 0) {
            this.errorMessage = 'No se puede conectar con el servidor. Verifica tu conexión.';
          } else {
            this.errorMessage = 'Ha ocurrido un error. Inténtalo de nuevo.';
          }
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registroForm.controls).forEach(key => {
      const control = this.registroForm.get(key);
      control?.markAsTouched();
    });
  }
}

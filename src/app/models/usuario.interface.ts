export enum TipoUsuario {
  PROPIETARIO = 'PROPIETARIO',
  CLIENTE = 'CLIENTE',
  AMBOS = 'AMBOS'
}

export interface Usuario {
  id?: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono?: string;
  tipoUsuario: 'CLIENTE' | 'PROPIETARIO' | 'AMBOS';
  verificado?: boolean;
  fechaRegistro?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegistroRequest {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  telefono?: string;
  tipoUsuario: string;
}

export interface AuthResponse {
  token: string;
  mensaje: string;
  exito: boolean;
  usuario: Usuario;
}

// Importaciones necesarias para evitar errores de referencia circular
import { Garaje } from './garaje.interface';
import { Reserva } from './reserva.interface'; 
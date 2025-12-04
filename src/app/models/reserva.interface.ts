export enum EstadoReserva {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADA = 'CONFIRMADA',
  EN_CURSO = 'EN_CURSO',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA',
  NO_PRESENTADO = 'NO_PRESENTADO'
}

export interface Reserva {
  id?: number;
  clienteId: number;
  garajeId: number;
  fechaInicio: Date;
  fechaFin: Date;
  precioGaraje: number;
  precioElectricidad: number;
  comisionPlataforma: number;
  precioTotal: number;
  estado: EstadoReserva;
  fechaCreacion?: Date;
}

export interface ReservaRequest {
  garajeId: number;
  fechaInicio: Date;
  fechaFin: Date;
}

export interface CalculoPrecioResponse {
  precioGaraje: number;
  precioElectricidad: number;
  comisionPlataforma: number;
  precioTotal: number;
  horas: number;
}

// Importaciones necesarias
import { Usuario } from './usuario.interface';
import { Garaje } from './garaje.interface'; 
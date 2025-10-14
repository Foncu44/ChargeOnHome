export enum TipoConector {
  TIPO_1 = 'TIPO_1',
  TIPO_2 = 'TIPO_2',
  CCS_COMBO_1 = 'CCS_COMBO_1',
  CCS_COMBO_2 = 'CCS_COMBO_2',
  CHADEMO = 'CHADEMO',
  TESLA_SUPERCHARGER = 'TESLA_SUPERCHARGER',
  SCHUKO = 'SCHUKO'
}

export interface Garaje {
  id?: number;
  propietarioId: number;
  direccion: string;
  latitud: number;
  longitud: number;
  ancho: number;
  largo: number;
  altura: number;
  precioPorHora: number;
  precioElectricidad: number;
  tipoConector: TipoConector;
  potenciaCarga: number;
  disponible24h: boolean;
  descripcion?: string;
  fotos: string[];
  activo: boolean;
  fechaCreacion: Date;
}

export interface GarajeRequest {
  direccion: string;
  latitud: number;
  longitud: number;
  ancho: number;
  largo: number;
  altura: number;
  precioPorHora: number;
  precioElectricidad: number;
  tipoConector: TipoConector;
  potenciaCarga: number;
  disponible24h: boolean;
  horarioInicio?: string;
  horarioFin?: string;
  descripcion?: string;
}

export interface FiltrosGaraje {
  ubicacion?: string;
  radio?: number;
  tipoConector?: TipoConector;
  potenciaMinima?: number;
  precioMaximo?: number;
  disponible24h?: boolean;
  fechaInicio?: Date;
  fechaFin?: Date;
}

// Importaciones necesarias
import { Usuario } from './usuario.interface';
import { Reserva } from './reserva.interface'; 
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva, ReservaRequest, CalculoPrecioResponse } from '../models/reserva.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = `${environment.apiUrl}/reservas`;

  constructor(private http: HttpClient) {}

  crearReserva(reserva: ReservaRequest): Observable<Reserva> {
    return this.http.post<Reserva>(this.apiUrl, reserva);
  }

  obtenerMisReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/mis-reservas`);
  }

  obtenerReservaPorId(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.apiUrl}/${id}`);
  }

  calcularPrecio(garajeId: number, fechaInicio: Date, fechaFin: Date): Observable<CalculoPrecioResponse> {
    const params = new HttpParams()
      .set('garajeId', garajeId.toString())
      .set('fechaInicio', fechaInicio.toISOString())
      .set('fechaFin', fechaFin.toISOString());

    return this.http.get<CalculoPrecioResponse>(`${this.apiUrl}/calcular-precio`, { params });
  }

  confirmarReserva(id: number): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.apiUrl}/${id}/confirmar`, {});
  }

  cancelarReserva(id: number): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.apiUrl}/${id}/cancelar`, {});
  }

  completarReserva(id: number): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.apiUrl}/${id}/completar`, {});
  }

  iniciarCarga(id: number): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.apiUrl}/${id}/iniciar`, {});
  }

  finalizarCarga(id: number, kwh: number): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.apiUrl}/${id}/finalizar`, { kwh });
  }

  valorarReserva(id: number, valoracion: number, comentario?: string): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.apiUrl}/${id}/valorar`, { valoracion, comentario });
  }

  obtenerReservasGaraje(garajeId: number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/garaje/${garajeId}`);
  }
}

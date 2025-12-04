import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Garaje, FiltrosGaraje } from '../models/garaje.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GarajeService {
  private apiUrl = `${environment.apiUrl}/garajes`;

  constructor(private http: HttpClient) {}

  obtenerGarajes(filtros?: FiltrosGaraje): Observable<Garaje[]> {
    let url = this.apiUrl;
    if (filtros) {
      const params = new URLSearchParams();
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
      if (params.toString()) {
        url += '?' + params.toString();
      }
    }
    return this.http.get<Garaje[]>(url);
  }

  obtenerGarajePorId(id: number): Observable<Garaje> {
    return this.http.get<Garaje>(`${this.apiUrl}/${id}`);
  }

  crearGaraje(garaje: Garaje): Observable<Garaje> {
    return this.http.post<Garaje>(this.apiUrl, garaje);
  }

  actualizarGaraje(id: number, garaje: Garaje): Observable<Garaje> {
    return this.http.put<Garaje>(`${this.apiUrl}/${id}`, garaje);
  }

  eliminarGaraje(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  obtenerMisGarajes(): Observable<Garaje[]> {
    return this.http.get<Garaje[]>(`${this.apiUrl}/mis-garajes`);
  }

  subirFotos(garajeId: number, fotos: File[]): Observable<string[]> {
    const formData = new FormData();
    fotos.forEach(foto => formData.append('fotos', foto));
    
    return this.http.post<string[]>(`${this.apiUrl}/${garajeId}/fotos`, formData);
  }

  buscarPorUbicacion(latitud: number, longitud: number, radio: number): Observable<Garaje[]> {
    const params = new URLSearchParams();
    params.append('latitud', latitud.toString());
    params.append('longitud', longitud.toString());
    params.append('radio', radio.toString());

    const url = `${this.apiUrl}/buscar?${params.toString()}`;
    return this.http.get<Garaje[]>(url);
  }
}

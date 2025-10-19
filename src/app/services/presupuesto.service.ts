import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Presupuesto, CrearPresupuestoDto } from '../models/presupuesto.model';
import { BASE_API_URL } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class PresupuestoService {
  private readonly apiUrl = `${BASE_API_URL}/presupuestos`;

  constructor(private http: HttpClient) {}

  obtenerTodosLosPresupuestos(): Observable<Presupuesto[]> {
    return this.http.get<Presupuesto[]>(`${this.apiUrl}/obtenerPresupuesto`);
  }

  obtenerPresupuestoActivo(): Observable<Presupuesto> {
    return this.http.get<Presupuesto>(`${this.apiUrl}/activo`);
  }

  activarPresupuesto(presupuestoId: number): Observable<string> {
    return this.http.put(
      `${this.apiUrl}/activar/${presupuestoId}`, 
      {},
      { responseType: 'text' as const }
    );
  }

  eliminarPresupuesto(presupuestoId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${presupuestoId}`);
  }

  crearPresupuesto(presupuesto: CrearPresupuestoDto): Observable<Presupuesto> {
    return this.http.post<Presupuesto>(`${this.apiUrl}/crear`, presupuesto);
  }

  actualizarPresupuesto(presupuestoId: number, presupuesto: Partial<Presupuesto>): Observable<Presupuesto> {
    return this.http.put<Presupuesto>(`${this.apiUrl}/${presupuestoId}`, presupuesto);
  }

  obtenerGastosPorPresupuesto(presupuestoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/obtenerGastosPorPresupuesto/${presupuestoId}`);
  }
}

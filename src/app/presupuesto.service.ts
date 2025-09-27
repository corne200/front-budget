import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Presupuesto } from './presupuesto.model';
import { BASE_API_URL } from './app.config';

@Injectable({
  providedIn: 'root'
})
export class PresupuestoService {
  private readonly baseUrl = BASE_API_URL;

  constructor(private http: HttpClient) {}

  obtenerPresupuesto(): Observable<Presupuesto[]> {
    return this.http.get<Presupuesto[]>(`${this.baseUrl}/presupuestos/obtenerPresupuesto`);
  }

  obtenerTodosLosPresupuestos(): Observable<Presupuesto[]> {
    return this.http.get<Presupuesto[]>(`${this.baseUrl}/obtenerTodosLosPresupuestos`);
  }

  crearPresupuesto(presupuesto: Partial<Presupuesto>): Observable<Presupuesto> {
    return this.http.post<Presupuesto>(`${this.baseUrl}/crearPresupuesto`, presupuesto);
  }

  actualizarPresupuesto(presupuesto: Presupuesto): Observable<Presupuesto> {
    return this.http.put<Presupuesto>(`${this.baseUrl}/actualizarPresupuesto/${presupuesto.presupuestoId}`, presupuesto);
  }

  eliminarPresupuesto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/eliminarPresupuesto/${id}`);
  }

  obtenerPresupuestoPorId(id: number): Observable<Presupuesto> {
    return this.http.get<Presupuesto>(`${this.baseUrl}/obtenerPresupuesto/${id}`);
  }

  obtenerPresupuestoActivo(): Observable<Presupuesto> {
    return this.http.get<Presupuesto>(`${this.baseUrl}/presupuestos/activo`);
  }
}

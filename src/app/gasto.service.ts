import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gasto } from './gasto.model';
import { BASE_API_URL } from './app.config';

@Injectable({
  providedIn: 'root'
})
export class GastoService {
  private readonly baseUrl = BASE_API_URL;

  constructor(private http: HttpClient) {}

  obtenerGastosPorPresupuesto(presupuestoId: number): Observable<Gasto[]> {
    return this.http.get<any[]>(`${this.baseUrl}/presupuestos/obtenerGastosPorPresupuesto/${presupuestoId}`);
  }

  obtenerTodosLosGastos(): Observable<Gasto[]> {
    return this.http.get<Gasto[]>(`${this.baseUrl}/api/gastos/todos`);
  }

  crearGasto(gasto: Partial<Gasto>): Observable<Gasto> {
    return this.http.post<Gasto>(`${this.baseUrl}/api/gastos/registrarGasto`, gasto);
  }

  actualizarGasto(gasto: Gasto): Observable<Gasto> {
    return this.http.put<Gasto>(`${this.baseUrl}/actualizarGasto/${gasto.gastoId}`, gasto);
  }

  eliminarGasto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/eliminarGasto/${id}`);
  }

  obtenerGastoPorId(id: number): Observable<Gasto> {
    return this.http.get<Gasto>(`${this.baseUrl}/obtenerGasto/${id}`);
  }
}

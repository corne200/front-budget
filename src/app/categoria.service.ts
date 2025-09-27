import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from './categoria.model';
import { BASE_API_URL } from './app.config';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private readonly baseUrl = `${BASE_API_URL}/api/categorias`;

  constructor(private http: HttpClient) {}

  obtenerTodasLasCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.baseUrl}/todas`);
  }

  crearCategoria(categoria: Partial<Categoria>): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.baseUrl}`, categoria);
  }

  actualizarCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.baseUrl}/${categoria.categoriaId}`, categoria);
  }

  eliminarCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  obtenerCategoriaPorId(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.baseUrl}/${id}`);
  }

  contarCategorias(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/contar`);
  }

  existeCategoria(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/existe/${id}`);
  }
}

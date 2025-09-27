import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { PresupuestoService } from '../../presupuesto.service';
import { Presupuesto } from '../../presupuesto.model';
import { NgIf } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { GastoService } from '../../gasto.service';
import { Gasto } from '../../gasto.model';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../categoria.service';
import { Categoria } from '../../categoria.model';

@Component({
  selector: 'app-presupuesto',
  standalone: true,
  templateUrl: './presupuesto.component.html',
  imports: [NgIf, CommonModule, TableModule, ButtonModule, RippleModule, CurrencyPipe, DatePipe],
  styleUrls: ['./presupuesto.component.css']
})
export class PresupuestoComponent implements OnInit {
  presupuesto: Presupuesto = { anio: 2028, mes: 9, sueldo: 1000, fechaCreacion: null, presupuestoId: 0, gastos: null };
  loading = true;
  error = '';
  gastos: Gasto[] = [];
  categorias: { [key: number]: string } = {};

  // Mapeo de meses
  meses: { [key: number]: string } = {
    1: 'Enero',
    2: 'Febrero',
    3: 'Marzo',
    4: 'Abril',
    5: 'Mayo',
    6: 'Junio',
    7: 'Julio',
    8: 'Agosto',
    9: 'Septiembre',
    10: 'Octubre',
    11: 'Noviembre',
    12: 'Diciembre'
  };

  constructor(
    private presupuestoService: PresupuestoService, 
    private gastosService: GastoService,
    private categoriaService: CategoriaService
  ) { }

  ngOnInit(): void {
    console.log('ngOnInit called');
    
    // Cargar categorías primero
    this.categoriaService.obtenerTodasLasCategorias().subscribe({
      next: (categorias: Categoria[]) => {
        // Convertir array de categorías a mapeo por ID
        this.categorias = categorias.reduce((map, categoria) => {
          map[categoria.categoriaId] = categoria.nombre;
          return map;
        }, {} as { [key: number]: string });
        console.log('categorías cargadas', this.categorias);
      },
      error: (err) => {
        console.error('Error al cargar categorías', err);
        // Fallback a categorías por defecto si falla la API
        this.categorias = {
          1: 'Alimentación',
          2: 'Transporte',
          3: 'Entretenimiento',
          4: 'Servicios',
          5: 'Salud',
          6: 'Otros'
        };
      }
    });

    this.presupuestoService.obtenerPresupuestoActivo().subscribe({
      next: (presupuesto: Presupuesto) => {
        console.log('presupuesto activo', presupuesto);
        this.presupuesto = presupuesto;

        const presupuestoId = this.presupuesto.presupuestoId;
        // Consultamos los gastos asociados al presupuesto
        this.gastosService.obtenerGastosPorPresupuesto(presupuestoId).subscribe({
          next: (gastos: Gasto[]) => {
            this.gastos = gastos;
            console.log('gastos recibidos', gastos);
            this.loading = false;
          },
          error: (err) => {
            console.error('Error al cargar gastos del presupuesto', err);
            this.error = 'Error al cargar los gastos del presupuesto';
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error al cargar presupuesto activo', err);
        this.error = 'Error al cargar el presupuesto activo';
        this.loading = false;
      }
    });
  }

  getCategoryName(categoriaId: number): string {
    return this.categorias[categoriaId] || `Categoría ${categoriaId}`;
  }

  getCategoryTotal(categoriaId: number): number {
    return this.gastos
      .filter(gasto => gasto.categoriaId === categoriaId)
      .reduce((total, gasto) => total + gasto.monto, 0);
  }

  getCategoryCount(categoriaId: number): number {
    return this.gastos.filter(gasto => gasto.categoriaId === categoriaId).length;
  }

  getTotalGastos(): number {
    return this.gastos.reduce((total, gasto) => total + gasto.monto, 0);
  }

  getSaldo(): number {
    return this.presupuesto.sueldo - this.getTotalGastos();
  }

  getMesNombre(mes: number): string {
    return this.meses[mes] || `Mes ${mes}`;
  }
}

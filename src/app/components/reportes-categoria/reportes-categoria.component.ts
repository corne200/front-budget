import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { PresupuestoService } from '../../services/presupuesto.service';
import { CategoriaService } from '../../categoria.service';
import { Presupuesto } from '../../models/presupuesto.model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Chart, ChartConfiguration, ChartType } from 'chart.js/auto';
import { forkJoin } from 'rxjs';

interface ReporteCategoria {
  categoria: string;
  totalGastos: number;
  porcentaje: number;
}

@Component({
  selector: 'app-reportes-categoria',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ProgressBarModule,
    ToastModule
  ],
  templateUrl: './reportes-categoria.component.html',
  styleUrls: ['./reportes-categoria.component.css'],
  providers: [MessageService]
})
export class ReportesCategoriaComponent implements OnInit, AfterViewChecked {
  presupuestoActivo: Presupuesto | null = null;
  reportes: ReporteCategoria[] = [];
  loading: boolean = true;

  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart: Chart | null = null;
  chartCreated = false;

  constructor(
    private presupuestoService: PresupuestoService,
    private categoriaService: CategoriaService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarReporte();
  }

  ngAfterViewChecked(): void {
    if (this.reportes.length > 0 && !this.chartCreated && this.chartCanvas) {
      this.createChart();
      this.chartCreated = true;
    }
  }

  cargarReporte(): void {
    this.loading = true;
    this.presupuestoService.obtenerPresupuestoActivo().subscribe({
      next: (presupuesto) => {
        this.presupuestoActivo = presupuesto;
        if (presupuesto) {
          this.generarReporte(presupuesto.presupuestoId!);
        } else {
          this.loading = false;
          this.messageService.add({
            severity: 'info',
            summary: 'Sin presupuesto activo',
            detail: 'No hay un presupuesto activo para generar reportes'
          });
        }
      },
      error: (error) => {
        console.error('Error al obtener presupuesto activo:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo obtener el presupuesto activo'
        });
        this.loading = false;
      }
    });
  }

  private generarReporte(presupuestoId: number): void {
    forkJoin({
      categorias: this.categoriaService.obtenerTodasLasCategorias(),
      gastos: this.presupuestoService.obtenerGastosPorPresupuesto(presupuestoId)
    }).subscribe({
      next: ({ categorias, gastos }) => {
        console.log('categorias', categorias);
        console.log('gastos', gastos);

        // Crear mapa de categoriaId a categoria para match rápido
        const categoriasMap = new Map<number, any>();
        categorias.forEach(categoria => {
          categoriasMap.set(categoria.categoriaId!, categoria);
        });

        const totalesPorCategoria: { [key: number]: { nombre: string, total: number } } = {};

        gastos.forEach(gasto => {
          if (gasto.categoriaId) {
            const categoria = categoriasMap.get(gasto.categoriaId);
            if (categoria) {
              if (!totalesPorCategoria[gasto.categoriaId]) {
                totalesPorCategoria[gasto.categoriaId] = {
                  nombre: categoria.nombre,
                  total: 0
                };
              }
              totalesPorCategoria[gasto.categoriaId].total += gasto.monto;
            }
          }
        });

        this.reportes = Object.values(totalesPorCategoria).map(item => ({
          categoria: item.nombre,
          totalGastos: item.total,
          porcentaje: this.presupuestoActivo ? (item.total / this.presupuestoActivo.sueldo) * 100 : 0
        }));

        this.loading = false;
        this.cdr.detectChanges();
        // El gráfico se creará automáticamente en ngAfterViewChecked
      },
      error: (error) => {
        console.error('Error al obtener categorías o gastos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron obtener las categorías o los gastos'
        });
        this.loading = false;
      }
    });
  }

  private createChart(): void {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destruir gráfico anterior si existe
    if (this.chart) {
      this.chart.destroy();
    }

    const config: ChartConfiguration = {
      type: 'doughnut' as ChartType,
      data: {
        labels: this.reportes.map(r => r.categoria),
        datasets: [{
          data: this.reportes.map(r => r.totalGastos),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#FF6384',
            '#C9CBCF',
            '#4BC0C0',
            '#FF6384'
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#FF6384',
            '#C9CBCF',
            '#4BC0C0',
            '#FF6384'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                return `${label}: $${value.toFixed(2)}`;
              }
            }
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  obtenerNombreMes(mes: number): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[mes - 1] || '';
  }
}

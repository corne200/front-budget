import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PresupuestoService } from '../../services/presupuesto.service';
import { Presupuesto, CrearPresupuestoDto } from '../../models/presupuesto.model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-ver-presupuestos',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    CardModule, 
    ButtonModule, 
    TableModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    DropdownModule,
    InputTextModule
  ],
  templateUrl: './ver-presupuestos.component.html',
  styleUrls: ['./ver-presupuestos.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class VerPresupuestosComponent implements OnInit {
  presupuestos: Presupuesto[] = [];
  loading: boolean = true;

  dialogVisible: boolean = false;
  selectedAnio: number | null = null;
  selectedMes: number | null = null;
  sueldo: number | null = null;
  anioOptions: {label: string, value: number}[] = [];
  mesOptions: {label: string, value: number}[] = [];

  constructor(
    private presupuestoService: PresupuestoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.cargarPresupuestos();
  }

  cargarPresupuestos(): void {
    this.loading = true;
    this.presupuestoService.obtenerTodosLosPresupuestos().subscribe({
      next: (data) => {
        // Ordenar por año (ascendente) y luego por mes (ascendente)
        this.presupuestos = data.sort((a, b) => {
          // Primero comparar por año (ascendente)
          if (a.anio !== b.anio) {
            return a.anio - b.anio;
          }
          // Si el año es el mismo, comparar por mes (ascendente)
          return a.mes - b.mes;
        });
        this.loading = false;
        this.generarOpcionesAnio();
      },
      error: (error) => {
        console.error('Error al cargar presupuestos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los presupuestos'
        });
        this.loading = false;
      }
    });
  }

  openDialog(): void {
    this.dialogVisible = true;
    this.resetForm();
    this.generarOpcionesAnio();
  }

  private resetForm(): void {
    this.selectedAnio = null;
    this.selectedMes = null;
    this.sueldo = null;
    this.mesOptions = [];
  }

  private generarOpcionesAnio(): void {
    if (this.presupuestos.length === 0) {
      const currentYear = new Date().getFullYear();
      this.anioOptions = Array.from({length: 11}, (_, i) => ({
        label: (currentYear + i).toString(),
        value: currentYear + i
      }));
      return;
    }

    const maxAnio = this.presupuestos[0].anio;
    this.anioOptions = Array.from({length: 11}, (_, i) => ({
      label: (maxAnio + i).toString(),
      value: maxAnio + i
    }));
  }

  onAnioChange(): void {
    if (!this.selectedAnio) {
      this.mesOptions = [];
      this.selectedMes = null;
      return;
    }

    const maxAnio = this.presupuestos.length > 0 ? this.presupuestos[0].anio : 0;
    const maxMes = this.presupuestos.length > 0 ? this.presupuestos[0].mes : 0;

    if (this.selectedAnio > maxAnio) {
      this.mesOptions = Array.from({length: 12}, (_, i) => ({
        label: this.obtenerNombreMes(i + 1),
        value: i + 1
      }));
    } else if (this.selectedAnio === maxAnio) {
      this.mesOptions = Array.from({length: 12 - maxMes}, (_, i) => ({
        label: this.obtenerNombreMes(maxMes + i + 1),
        value: maxMes + i + 1
      }));
    } else {
      this.mesOptions = [];
    }
    this.selectedMes = null;
  }

  aceptarCrearPresupuesto(): void {
    if (!this.selectedAnio || !this.selectedMes || !this.sueldo) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Todos los campos son obligatorios'
      });
      return;
    }

    const dto: CrearPresupuestoDto = {
      anio: this.selectedAnio,
      mes: this.selectedMes,
      sueldo: this.sueldo
    };

    this.presupuestoService.crearPresupuesto(dto).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Presupuesto creado correctamente'
        });
        this.dialogVisible = false;
        this.cargarPresupuestos();
      },
      error: (error) => {
        console.error('Error al crear presupuesto:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear el presupuesto'
        });
      }
    });
  }

  confirmarEliminar(presupuesto: Presupuesto): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el presupuesto de ${this.obtenerNombreMes(presupuesto.mes)} ${presupuesto.anio}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.eliminarPresupuesto(presupuesto.presupuestoId!)
    });
  }

  private eliminarPresupuesto(presupuestoId: number): void {
    this.presupuestoService.eliminarPresupuesto(presupuestoId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Presupuesto eliminado correctamente'
        });
        this.cargarPresupuestos();
      },
      error: (error) => {
        console.error('Error al eliminar presupuesto:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el presupuesto'
        });
      }
    });
  }

  obtenerNombreMes(mes: number): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[mes - 1] || '';
  }

  activarPresupuesto(presupuestoId: number): void {
    this.presupuestoService.activarPresupuesto(presupuestoId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Presupuesto activado correctamente'
        });
        this.cargarPresupuestos();
      },
      error: (error) => {
        console.error('Error al activar presupuesto:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo activar el presupuesto'
        });
      }
    });
  }
}

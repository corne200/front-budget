import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { GastoService } from '../../gasto.service';
import { CategoriaService } from '../../categoria.service';
import { PresupuestoService } from '../../presupuesto.service';
import { Categoria } from '../../categoria.model';
import { Presupuesto } from '../../presupuesto.model';

@Component({
  selector: 'app-registrar-gasto',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    CalendarModule,
    InputTextareaModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './registrar-gasto.component.html',
  styleUrl: './registrar-gasto.component.css'
})
export class RegistrarGastoComponent implements OnInit {
  gastoForm: FormGroup;
  categorias: Categoria[] = [];
  presupuestoActivo: Presupuesto | null = null;
  cargandoCategorias = false;
  cargandoPresupuestoActivo = false;
  guardando = false;

  // Mapeo de meses para mostrar nombre en la UI
  private meses: { [key: number]: string } = {
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
    private fb: FormBuilder,
    private gastoService: GastoService,
    private categoriaService: CategoriaService,
    private presupuestoService: PresupuestoService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.gastoForm = this.fb.group({
      descripcion: ['', [Validators.required, Validators.minLength(3)]],
      monto: [null, [Validators.required, Validators.min(0.01)]],
      fecha: [new Date(), Validators.required],
      categoriaId: [null, Validators.required],
      presupuestoId: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.cargarCategorias();
    this.cargarPresupuestoActivo();
  }

  cargarCategorias() {
    this.cargandoCategorias = true;
    this.categoriaService.obtenerTodasLasCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.cargandoCategorias = false;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las categorías'
        });
        this.cargandoCategorias = false;
      }
    });
  }

  cargarPresupuestoActivo() {
    this.cargandoPresupuestoActivo = true;
    this.presupuestoService.obtenerPresupuestoActivo().subscribe({
      next: (presupuesto) => {
        this.presupuestoActivo = presupuesto;
        this.gastoForm.patchValue({ presupuestoId: presupuesto.presupuestoId });
        this.cargandoPresupuestoActivo = false;
      },
      error: (error) => {
        console.error('Error al cargar presupuesto activo:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Sin presupuesto activo',
          detail: 'No hay presupuesto activo. No es posible registrar gastos.'
        });
        this.cargandoPresupuestoActivo = false;
      }
    });
  }

  onSubmit() {
    if (this.gastoForm.valid) {
      this.guardando = true;
      const gastoData = {
        ...this.gastoForm.value,
        fecha: this.formatearFecha(this.gastoForm.value.fecha)
      };

      this.gastoService.crearGasto(gastoData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Gasto registrado correctamente'
          });
          
          this.gastoForm.reset({
            fecha: new Date()
          });
          
          this.guardando = false;
          
          setTimeout(() => {
            this.router.navigate(['/gastos']);
          }, 1500);
        },
        error: (error) => {
          console.error('Error al registrar gasto:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo registrar el gasto'
          });
          this.guardando = false;
        }
      });
    } else {
      this.marcarCamposComoTocados();
    }
  }

  formatearFecha(fecha: Date): string {
    if (!fecha) return '';
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  marcarCamposComoTocados() {
    Object.keys(this.gastoForm.controls).forEach(key => {
      this.gastoForm.get(key)?.markAsTouched();
    });
  }

  limpiarFormulario() {
    this.gastoForm.reset({
      fecha: new Date()
    });
    // Si hay presupuesto activo, mantener el presupuestoId en el formulario
    if (this.presupuestoActivo?.presupuestoId) {
      this.gastoForm.patchValue({ presupuestoId: this.presupuestoActivo.presupuestoId });
    }
  }

  getMesNombre(mes: number): string {
    return this.meses[mes] || `Mes ${mes}`;
  }
}

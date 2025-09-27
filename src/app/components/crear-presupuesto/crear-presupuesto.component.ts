import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PresupuestoService } from '../../presupuesto.service';

interface OpcionMes {
  label: string;
  value: string;
}

interface OpcionAnio {
  label: string;
  value: number;
}

@Component({
  selector: 'app-crear-presupuesto',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    InputTextareaModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './crear-presupuesto.component.html',
  styleUrls: ['./crear-presupuesto.component.css']
})
export class CrearPresupuestoComponent implements OnInit {
  presupuestoForm: FormGroup;
  guardando = false;

  meses: OpcionMes[] = [
    { label: 'Enero', value: 'Enero' },
    { label: 'Febrero', value: 'Febrero' },
    { label: 'Marzo', value: 'Marzo' },
    { label: 'Abril', value: 'Abril' },
    { label: 'Mayo', value: 'Mayo' },
    { label: 'Junio', value: 'Junio' },
    { label: 'Julio', value: 'Julio' },
    { label: 'Agosto', value: 'Agosto' },
    { label: 'Septiembre', value: 'Septiembre' },
    { label: 'Octubre', value: 'Octubre' },
    { label: 'Noviembre', value: 'Noviembre' },
    { label: 'Diciembre', value: 'Diciembre' }
  ];

  anos: OpcionAnio[] = [];

  constructor(
    private fb: FormBuilder,
    private presupuestoService: PresupuestoService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.presupuestoForm = this.fb.group({
      anio: [new Date().getFullYear(), Validators.required],
      mes: [this.obtenerMesActual(), Validators.required],
      sueldo: [null, [Validators.required, Validators.min(1)]],
      descripcion: ['']
    });
  }

  ngOnInit() {
    this.generarOpcionesAnios();
  }

  obtenerMesActual(): string {
    const mesActual = new Date().getMonth();
    return this.meses[mesActual].value;
  }

  generarOpcionesAnios() {
    const anioActual = new Date().getFullYear();
    for (let i = anioActual - 2; i <= anioActual + 5; i++) {
      this.anos.push({ label: i.toString(), value: i });
    }
  }

  onSubmit() {
    if (this.presupuestoForm.valid) {
      this.guardando = true;
      const presupuestoData = this.presupuestoForm.value;

      this.presupuestoService.crearPresupuesto(presupuestoData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Presupuesto creado correctamente'
          });
          
          // Resetear formulario
          this.presupuestoForm.reset({
            anio: new Date().getFullYear(),
            mes: this.obtenerMesActual(),
            descripcion: ''
          });
          
          this.guardando = false;
          
          // Redirigir después de un breve delay
          setTimeout(() => {
            this.router.navigate(['/presupuestos']);
          }, 1500);
        },
        error: (error) => {
          console.error('Error al crear presupuesto:', error);
          
          let mensaje = 'No se pudo crear el presupuesto';
          if (error.status === 409) {
            mensaje = 'Ya existe un presupuesto para este año y mes';
          }
          
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: mensaje
          });
          this.guardando = false;
        }
      });
    } else {
      this.marcarCamposComoTocados();
    }
  }

  marcarCamposComoTocados() {
    Object.keys(this.presupuestoForm.controls).forEach(key => {
      this.presupuestoForm.get(key)?.markAsTouched();
    });
  }

  limpiarFormulario() {
    this.presupuestoForm.reset({
      anio: new Date().getFullYear(),
      mes: this.obtenerMesActual(),
      sueldo: null,
      descripcion: ''
    });
  }
}

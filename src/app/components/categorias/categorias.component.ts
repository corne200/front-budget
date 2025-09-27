import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CategoriaService } from '../../categoria.service';
import { Categoria } from '../../categoria.model';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    ToolbarModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  categoriaForm: FormGroup;
  mostrarDialogo = false;
  esEdicion = false;
  categoriaSeleccionada: Categoria | null = null;
  cargando = false;
  guardando = false;

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.categoriaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: ['']
    });
  }

  ngOnInit() {
    this.cargarCategorias();
  }

  get tituloDialogo(): string {
    return this.esEdicion ? 'Editar Categoría' : 'Nueva Categoría';
  }

  cargarCategorias() {
    this.cargando = true;
    this.categoriaService.obtenerTodasLasCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las categorías'
        });
        this.cargando = false;
      }
    });
  }

  abrirDialogoNueva() {
    this.esEdicion = false;
    this.categoriaSeleccionada = null;
    this.categoriaForm.reset();
    this.mostrarDialogo = true;
  }

  editarCategoria(categoria: Categoria) {
    this.esEdicion = true;
    this.categoriaSeleccionada = categoria;
    this.categoriaForm.patchValue({
      nombre: categoria.nombre
    });
    this.mostrarDialogo = true;
  }

  cerrarDialogo() {
    this.mostrarDialogo = false;
    this.categoriaForm.reset();
    this.categoriaSeleccionada = null;
    this.esEdicion = false;
  }

  guardarCategoria() {
    if (this.categoriaForm.valid) {
      this.guardando = true;
      const categoriaData = this.categoriaForm.value;

      if (this.esEdicion && this.categoriaSeleccionada) {
        // Actualizar categoría existente
        const categoriaActualizada = {
          ...this.categoriaSeleccionada,
          ...categoriaData
        };

        this.categoriaService.actualizarCategoria(categoriaActualizada).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Categoría actualizada correctamente'
            });
            this.cargarCategorias();
            this.cerrarDialogo();
            this.guardando = false;
          },
          error: (error) => {
            console.error('Error al actualizar categoría:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo actualizar la categoría'
            });
            this.guardando = false;
          }
        });
      } else {
        // Crear nueva categoría
        this.categoriaService.crearCategoria(categoriaData).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Categoría creada correctamente'
            });
            this.cargarCategorias();
            this.cerrarDialogo();
            this.guardando = false;
          },
          error: (error) => {
            console.error('Error al crear categoría:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo crear la categoría'
            });
            this.guardando = false;
          }
        });
      }
    } else {
      this.marcarCamposComoTocados();
    }
  }

  confirmarEliminar(categoria: Categoria) {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea eliminar la categoría "${categoria.nombre}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.eliminarCategoria(categoria);
      }
    });
  }

  eliminarCategoria(categoria: Categoria) {
    this.categoriaService.eliminarCategoria(categoria.categoriaId).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Categoría eliminada correctamente'
        });
        this.cargarCategorias();
      },
      error: (error) => {
        console.error('Error al eliminar categoría:', error);
        let mensaje = 'No se pudo eliminar la categoría';
        
        if (error.status === 409) {
          mensaje = 'No se puede eliminar la categoría porque tiene gastos asociados';
        }
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: mensaje
        });
      }
    });
  }

  marcarCamposComoTocados() {
    Object.keys(this.categoriaForm.controls).forEach(key => {
      this.categoriaForm.get(key)?.markAsTouched();
    });
  }
}

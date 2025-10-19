import { Routes } from '@angular/router';
import { PresupuestoComponent } from './components/presupuesto/presupuesto.component';
import { LayoutComponent } from './components/layout/layout.component';
import { RegistrarGastoComponent } from './components/registrar-gasto/registrar-gasto.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { VerPresupuestosComponent } from './components/ver-presupuestos/ver-presupuestos.component';
import { ReportesCategoriaComponent } from './components/reportes-categoria/reportes-categoria.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'gastos', pathMatch: 'full' },
      { 
        path: 'presupuestos', 
        component: VerPresupuestosComponent 
      },
      { 
        path: 'presupuestos/antiguos', 
        component: PresupuestoComponent 
      },
      { 
        path: 'gastos', 
        component: PresupuestoComponent 
      },
      { path: 'gastos/nuevo', component: RegistrarGastoComponent },
      { path: 'categorias', component: CategoriasComponent },
      { path: 'reportes/categoria', component: ReportesCategoriaComponent },
    ]
  },
  // Rutas de compatibilidad (redirigen a las nuevas rutas)
  { path: 'presupuesto', redirectTo: '/presupuestos', pathMatch: 'full' },
  { path: 'registrar-gasto', redirectTo: '/gastos/nuevo', pathMatch: 'full' },
  { path: 'crear-presupuesto', redirectTo: '/presupuestos/nuevo', pathMatch: 'full' }
];

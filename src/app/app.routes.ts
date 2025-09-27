import { Routes } from '@angular/router';
import { PresupuestoComponent } from './components/presupuesto/presupuesto.component';
import { LayoutComponent } from './components/layout/layout.component';
import { RegistrarGastoComponent } from './components/registrar-gasto/registrar-gasto.component';
import { CrearPresupuestoComponent } from './components/crear-presupuesto/crear-presupuesto.component';
import { CategoriasComponent } from './components/categorias/categorias.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'presupuestos', pathMatch: 'full' },
      { path: 'presupuestos', component: PresupuestoComponent },
      { path: 'presupuestos/nuevo', component: CrearPresupuestoComponent },
      { path: 'gastos', component: PresupuestoComponent }, // Temporal - reutiliza PresupuestoComponent para mostrar gastos
      { path: 'gastos/nuevo', component: RegistrarGastoComponent },
      { path: 'categorias', component: CategoriasComponent },
    ]
  },
  // Rutas de compatibilidad (redirigen a las nuevas rutas)
  { path: 'presupuesto', redirectTo: '/presupuestos', pathMatch: 'full' },
  { path: 'registrar-gasto', redirectTo: '/gastos/nuevo', pathMatch: 'full' },
  { path: 'crear-presupuesto', redirectTo: '/presupuestos/nuevo', pathMatch: 'full' }
];

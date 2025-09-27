import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarModule,
    ButtonModule,
    MenuModule,
    PanelMenuModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  sidebarVisible = false;

  menuItems: MenuItem[] = [
    {
      label: 'Gastos',
      icon: 'pi pi-money-bill',
      items: [
        {
          label: 'Ver Gastos',
          icon: 'pi pi-eye',
          routerLink: '/gastos'
        },
        {
          label: 'Registrar Gasto',
          icon: 'pi pi-plus',
          routerLink: '/gastos/nuevo'
        }
      ]
    },
    {
      label: 'Presupuestos',
      icon: 'pi pi-calculator',
      items: [
        {
          label: 'Ver Presupuestos',
          icon: 'pi pi-list',
          routerLink: '/presupuestos'
        },
        {
          label: 'Crear Presupuesto',
          icon: 'pi pi-plus-circle',
          routerLink: '/presupuestos/nuevo'
        }
      ]
    },
    {
      label: 'Categorías',
      icon: 'pi pi-tags',
      items: [
        {
          label: 'Gestionar Categorías',
          icon: 'pi pi-cog',
          routerLink: '/categorias'
        }
      ]
    },
    {
      label: 'Reportes',
      icon: 'pi pi-chart-bar',
      items: [
        {
          label: 'Generar Reportes',
          icon: 'pi pi-file-pdf',
          routerLink: '/reportes'
        }
      ]
    }
  ];

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}

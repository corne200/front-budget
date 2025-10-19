export interface Presupuesto {
  presupuestoId?: number;
  mes: number;
  anio: number;
  sueldo: number;
  activo: boolean;
  fechaCreacion?: Date;
  gastos?: any[]; // Puedes tipar esto mejor si es necesario
}

export interface CrearPresupuestoDto {
  mes: number;
  anio: number;
  sueldo: number;
}

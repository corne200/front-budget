export interface Presupuesto {
  presupuestoId: number;
  anio: number;
  mes: number;
  sueldo: number;
  fechaCreacion: string | null;
  gastos: any | null;
}

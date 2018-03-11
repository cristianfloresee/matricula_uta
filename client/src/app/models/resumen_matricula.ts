export class Resumen_Matricula {
    
    ingreso_regular: number;
    ingreso_especial: number;
    otros_ingresos: number;
    total_alumnos_nuevos: number;
    total_alumnos_antiguos: number;
    matricula_total: number;

    constructor(object) {
        this.ingreso_regular = object.REGULAR;
        this.ingreso_especial = object.INGRESO_ESPECIAL;
        this.otros_ingresos = object.OTROS_INGRESOS;
        this.total_alumnos_antiguos = object.ANTIGUOS;
        this.totalAlumnosNuevos();
        this.matriculaTotal();
    }

    totalAlumnosNuevos() {
        this.total_alumnos_nuevos = (this.ingreso_regular + this.ingreso_especial + this.otros_ingresos);
    }

    matriculaTotal(){
        this.matricula_total = (this.total_alumnos_nuevos + this.total_alumnos_antiguos);
    }
    
}

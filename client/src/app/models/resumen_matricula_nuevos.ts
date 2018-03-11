export class Resumen_Matricula_Nuevos {
    
    codigo_carrera: number;
    carrera: string;

    seleccionados: number;
    lista_espera: number;
    repostulacion: number;
    ingreso_especial: number;

    matricula_vacante: number;
    matricula_total: number

    porcentaje: number;

    constructor(object) {
        this.codigo_carrera = object.CC;
        this.carrera = object.CARRERA;
        this.seleccionados = object.SELECCIONADOS;
        this.lista_espera = object.LISTA_ESPERA;
        this.repostulacion = object.REPOSTULACION;
        this.ingreso_especial = object.INGRESO_ESPECIAL;
        this.matricula_vacante = object.VACANTES;
        //FACULTAD
        //SEDE
        //AÑO
        this.matriculaTotal();
    }

    matriculaTotal(){
        this.matricula_total = (this.seleccionados + this.ingreso_especial)
    }

    calcularPorcentaje(){
        this.porcentaje = ((this.matricula_total*100) / this.matricula_vacante);    
    }

}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ResumenService {

    private annio_selected = new BehaviorSubject<number>(0);
    current_annio = this.annio_selected.asObservable();
    private sede_selected = new BehaviorSubject<number>(0);
    current_sede = this.sede_selected.asObservable();

    private data_resumen = new BehaviorSubject<Object>({});
    current_resumen = this.data_resumen.asObservable();

    constructor() { }

    setAnnio(data: number) {
        this.annio_selected.next(data)
        console.log(this.annio_selected);
    }

    setSede(data: number) {
        this.sede_selected.next(data)
        console.log(this.sede_selected);
    }

    setResumen(data: Object) {
        this.data_resumen.next(data)
        console.log(this.data_resumen);
    }

}
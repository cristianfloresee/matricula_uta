import { Component, OnInit } from '@angular/core';
import { ResumenService } from "../../services/resumen.service";

@Component({
  selector: 'app-resumen-matriculas',
  templateUrl: './resumen-matriculas.component.html',
  styleUrls: ['./resumen-matriculas.component.css']
})
export class ResumenMatriculasComponent implements OnInit {

  resumen_matriculados;
  annioSelected;
  sedeSelected;
  constructor(private data: ResumenService) { }

  ngOnInit() {
    this.data.current_resumen.subscribe(resumen => this.resumen_matriculados = resumen)
    this.data.current_annio.subscribe(annio => this.annioSelected = annio)
    this.data.current_sede.subscribe(sede => this.sedeSelected = sede)
  }

}

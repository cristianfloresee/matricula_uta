import { Component, OnInit, ViewChild } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { Chart } from 'chart.js';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import { ResumenService } from "../../services/resumen.service";
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    @ViewChild("baseChart") chart: BaseChartDirective;

    resumen_matriculados;
    resumen_matriculados_nuevos;

    annioSelected: number;
    sedeSelected: number;

    static_cities; //ELEMENTOS ESTATICOS COMO REFERENCIA PARA EL GRAFICO
    cities; //ELEMENTOS ORDENABLES //TEMPORAL
    ioConnection: any;

    items;
    chart_ready = false;

    /**CHART CONF**/
    barChartLabels: string[] = []; //VACIO??
    barChartType: string = 'bar';
    barChartLegend: boolean = true;
    barChartData: any[] = [];
    barChartColors: Array<any> = [];
    barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true,
        legend: {
            display: true,
            position: 'left'
        },
        scales: {
            xAxes: [{
                display: false
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };

    city_changes = [];
    change_votes = [];

    up = [];

    color_map = [
        '#f44336', //red
        '#9c27b0', //purple
        '#3f51b5', //indigo
        '#03a9f4', //light_blue
        '#4caf50', //green
        '#ffc107', //amber
        '#cddc39', //lime
        '#ff5722', //deep_orange
        '#607d8b', //blue_gray
        '#e91e63', //pink
        '#673ab7', //deep_purple
        '#00bcd4', //cyan
        '#8bc34a', //lightgreen
        '#ffeb3b', //yellow
        '#ff9800', //orange
        '#9e9e9e', //gray
        '#2196f3', //blue
        '#009688', //teal
        '#795548'
    ];

    set_colors = [];

    //matriculasForm: FormGroup;
    dato;
    constructor(
        private socketService: SocketService,
        private formBuilder: FormBuilder,
        private data: ResumenService
    ) {


        let response = [
            {
                "ANNIO": 2018,
                "SEDES": [
                    {
                        "SEDE": "ARICA",
                        "REGULAR": 111,
                        "INGRESO_ESPECIAL": 111,
                        "OTROS_INGRESOS": 111,
                        "ANTIGUOS": 111
                    },
                    {
                        "SEDE": "IQUIQUE",
                        "REGULAR": 111,
                        "INGRESO_ESPECIAL": 111,
                        "OTROS_INGRESOS": 111,
                        "ANTIGUOS": 111
                    }
                ]


            },
            {
                "ANNIO": 2017,
                "SEDES": [
                    {
                        "SEDE": "TACNA",
                        "REGULAR": 222,
                        "INGRESO_ESPECIAL": 222,
                        "OTROS_INGRESOS": 222,
                        "ANTIGUOS": 222
                    },
                    {
                        "SEDE": "LIMA",
                        "REGULAR": 222,
                        "INGRESO_ESPECIAL": 222,
                        "OTROS_INGRESOS": 222,
                        "ANTIGUOS": 222
                    }
                ]
            }
        ];

        this.data.setResumen(response);
        
        /*
        this.matriculasForm = new FormGroup({
            resumen: new FormControl(this.resumen_matriculados[0]),
            sede: new FormControl(this.resumen_matriculados[0].SEDES[0]),
        });
        console.log("neen: ", this.matriculasForm.value.resumen.SEDES[0]);
        */

      

    }

    ngOnInit() {
        //this.initIoConnection();
        this.data.current_resumen.subscribe(data_resumen => this.resumen_matriculados = data_resumen)
        this.data.current_annio.subscribe(annio => this.annioSelected = annio)
        this.data.current_sede.subscribe(sede => this.sedeSelected = sede)
    }

    private initIoConnection(): void {
        this.socketService.initSocket()

        this.socketService.getMatriculas() //PIDO LOS DATOS AL SERVIDOR
            .then(data => {
                this.resumen_matriculados = data[0];
                this.resumen_matriculados_nuevos = data[1];

                console.log("resumen_matriculas: ", this.resumen_matriculados);
                console.log("resumen_matriculas_nuevos: ", this.resumen_matriculados_nuevos);

            })
            .catch(error => console.log(error));

        this.ioConnection = this.socketService.onChange()
            .subscribe((response) => {

                //console.log("response: ", response);
                let clone = JSON.parse(JSON.stringify(this.barChartData));

                for (let i = 0; i < response.length; i++) {



                    //AGREGO LOS VOTOS //SE PUEDE HACER MAS FACIL SI SOLO DEVUELVEN EL OBJETO MODIFICADO
                    for (let j = 0; j < response.length; j++) {
                        if ((this.static_cities[i].ID == response[j].ID) && (this.static_cities[i].VOTES != response[j].VOTES)) {
                            clone[i].data[0] = response[j].VOTES; //AUMENTO VOTOS PARA EL GRAFICO
                            this.static_cities[i].VOTES = response[j].VOTES; //AUMENTO VOTO A ESTATICOS (PARA SABER CUANDO AUMENTA DESPUES)

                            for (let k = 0; k < response.length; k++) {
                                if (this.static_cities[i].ID == this.cities[k].ID) {
                                    this.cities.VOTES = this.static_cities.VOTES;
                                }
                            }

                        }
                    }
                }
                this.barChartData = clone;




            })
    }

    changeAnnio(){
        this.data.setAnnio(this.annioSelected)
        this.data.setSede(0);
    }

    changeSede(){
        this.data.setSede(this.sedeSelected);
    }

    shuffle() {
      
        let random = [
            {
                "ANNIO": 2018,
                "SEDES": [
                    {
                        "SEDE": "ARICA",
                        "REGULAR": Math.floor(Math.random() * 10000),
                        "INGRESO_ESPECIAL": Math.floor(Math.random() * 10000),
                        "OTROS_INGRESOS": Math.floor(Math.random() * 10000),
                        "ANTIGUOS": Math.floor(Math.random() * 10000)
                    },
                    {
                        "SEDE": "IQUIQUE",
                        "REGULAR": Math.floor(Math.random() * 10000),
                        "INGRESO_ESPECIAL": Math.floor(Math.random() * 10000),
                        "OTROS_INGRESOS": Math.floor(Math.random() * 10000),
                        "ANTIGUOS": Math.floor(Math.random() * 10000)
                    }
                ]


            },
            {
                "ANNIO": 2017,
                "SEDES": [
                    {
                        "SEDE": "TACNA",
                        "REGULAR": Math.floor(Math.random() * 10000),
                        "INGRESO_ESPECIAL": Math.floor(Math.random() * 10000),
                        "OTROS_INGRESOS": Math.floor(Math.random() * 10000),
                        "ANTIGUOS": Math.floor(Math.random() * 10000)
                    },
                    {
                        "SEDE": "LIMA",
                        "REGULAR": Math.floor(Math.random() * 10000),
                        "INGRESO_ESPECIAL": Math.floor(Math.random() * 10000),
                        "OTROS_INGRESOS": Math.floor(Math.random() * 10000),
                        "ANTIGUOS": Math.floor(Math.random() * 10000)
                    }
                ]
            }
        ];
        this.data.setResumen(random);
        console.log("nuevo objeto: ", random);

      
    }
}


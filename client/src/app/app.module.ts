import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//MODULOS DEL CORE PERO QUE NO VIENEN POR DEFECTO
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { SocketService } from './services/socket.service';

import { ChartsModule } from 'ng2-charts';
import { TransitionGroupComponent, TransitionGroupItemDirective } from './transition-group/transition-group.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResumenMatriculasComponent } from './components/resumen-matriculas/resumen-matriculas.component';
import { AlumnosNuevosComponent } from './components/alumnos-nuevos/alumnos-nuevos.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TransitionGroupComponent,
    TransitionGroupItemDirective,
    ResumenMatriculasComponent,
    AlumnosNuevosComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    ChartsModule
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }

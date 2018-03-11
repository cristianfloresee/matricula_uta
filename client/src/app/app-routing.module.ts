import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ResumenMatriculasComponent } from './components/resumen-matriculas/resumen-matriculas.component';
import { AlumnosNuevosComponent } from './components/alumnos-nuevos/alumnos-nuevos.component';


const routes: Routes = [
  { path: '', component: ResumenMatriculasComponent},
  { path: 'resumen', component: ResumenMatriculasComponent},
  { path: 'nuevos', component: AlumnosNuevosComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

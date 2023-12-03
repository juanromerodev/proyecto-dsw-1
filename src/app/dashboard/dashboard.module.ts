import { AgregarEditarComponent as er } from './ensayos/agregar-editar/agregar-editar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MaterialModule } from '../material/material.module';
import { ListarPageComponent } from './Participantes/listar-page/listar-page.component';
import { ListarPageComponent as EnsayosListarPageComponent } from './ensayos/listar-page/listar-page.component';
import { MenuComponent } from './menu/menu.component';
import { AgregarEditarComponent  } from './Participantes/agregar-editar/agregar-editar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ListarPageComponent,
    EnsayosListarPageComponent,
    MenuComponent,
    AgregarEditarComponent,
    er
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class DashboardModule { }

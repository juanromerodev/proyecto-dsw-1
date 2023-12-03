import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { ListarPageComponent } from './Participantes/listar-page/listar-page.component';
import { ListarPageComponent as EnsayosListarPageComponent } from './ensayos/listar-page/listar-page.component';

const routes: Routes = [
  {
    path: '',
    component: MenuComponent,
    children: [
      {
        path: 'listar',
        component: ListarPageComponent,
      },
      {
        path: 'ensayos',
        component: EnsayosListarPageComponent,
      },
      { path: '**', redirectTo: 'listar' },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }

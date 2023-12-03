import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  public sidebarItems = [
    { label: 'Participantes', icon: 'people', url: './listar', colorClass: 'red-color' }, 
    { label: 'Ensayos', icon: 'description', url: './ensayos', colorClass: 'custom-color' }, 
  ];
}

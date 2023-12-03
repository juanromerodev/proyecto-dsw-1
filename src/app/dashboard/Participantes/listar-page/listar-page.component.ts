import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ParticipantesService } from '../services/participantes.service';
import { Participantes } from '../model/participantes';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import swall from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { AgregarEditarComponent } from '../agregar-editar/agregar-editar.component';

@Component({
  selector: 'app-listar-page',
  templateUrl: './listar-page.component.html',
  styleUrls:['./listar-page.component.css']
})
export class ListarPageComponent implements AfterViewInit, OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columnas: string[] = [
    'ID',
    'NOMBRE',
    'APELLIDOS',
    'DNI',
    'FECHANACIMIENTO',
    'CORREO',
    'ACCIONES',
  ];
  dataSource = new MatTableDataSource<Participantes>();

  constructor(
    private participantesService: ParticipantesService,
    public dialog: MatDialog
    ) {}

  ngOnInit(): void {
    this.obtenerListadoParticipantes();
  }

  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Paginas';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.previousPageLabel = 'Atras';
    this.dataSource.paginator = this.paginator;
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  obtenerListadoParticipantes(): void {
    this.participantesService.listarParticipantes().subscribe({
      next: (resultado) => {
        this.dataSource = new MatTableDataSource(resultado);
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        swall.fire({
          icon: 'error',
          confirmButtonColor: '#d33',
          html: `Hubo un error al hacer el listado`,
        });

      },
    });
  }


  nuevoParticipante(){
    this.dialog.open(AgregarEditarComponent, {
      width:'470px',
      }).afterClosed().subscribe(valor =>{
        this.obtenerListadoParticipantes();
    });
  }

  editarParticipante(fila: any){
    this.dialog.open(AgregarEditarComponent,{
      width:'470px',
      data:fila
    }).afterClosed().subscribe(valor =>{
      this.obtenerListadoParticipantes();
    });
  }

  eliminarParticipante(fila: any){
    swall.fire({
      html: `¿Estás seguro de eliminar al participante:  <strong>${fila.nmbrs}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0275d8',
      cancelButtonColor: '#9c9c9c',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.participantesService.eliminarParticipante(fila.participanteId).subscribe({
          next: (res) => {
            swall.fire({
              icon: 'success',
              html: `Usuario <strong>${fila.nmbrs}</strong> eliminado con éxito!`,
            });
            this.obtenerListadoParticipantes();
          },
          error: (error) => {
            swall.fire({
              icon: 'error',
              html: `No se pudo eliminar Error: ${error.message}`,
            });
          },
        });
      }
    });
  }
}

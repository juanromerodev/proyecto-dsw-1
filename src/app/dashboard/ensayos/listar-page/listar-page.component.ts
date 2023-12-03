import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import swall from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { Ensayo } from '../model/ensayos';
import { EnsayosService } from '../services/ensayos.service';
import { AgregarEditarComponent } from '../agregar-editar/agregar-editar.component';


@Component({
  selector: 'app-listar-page',
  templateUrl: './listar-page.component.html',
  styleUrls:['./listar-page.component.css']
})
export class ListarPageComponent implements AfterViewInit, OnInit{

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columnas: string[] = [
    'ID',
    'DESCRIPCION',
    'PARTICIPANTE',
    'FECHAENTREGA',
    'ACCIONES',
  ];
  dataSource = new MatTableDataSource<Ensayo>();

  constructor(
    private ensayoService: EnsayosService,
    public dialog: MatDialog
    ) {}

  ngOnInit(): void {
    this.obtenerListadoEnsayos();
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

  obtenerListadoEnsayos(): void {
    this.ensayoService.listarEnsayos().subscribe({
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
        console.log(error)
      },
    });
  }

  nuevoEnsayo(){
    this.dialog.open(AgregarEditarComponent, {
      width:'470px',
      }).afterClosed().subscribe(valor =>{
        this.obtenerListadoEnsayos();
    });
  }

  editarEnsayo(fila: any){
    this.dialog.open(AgregarEditarComponent,{
      width:'470px',
      data:fila
    }).afterClosed().subscribe(valor =>{
      this.obtenerListadoEnsayos();
    });
  }

  eliminarEnsayo(fila: any){
    swall.fire({
      html: `¿Estás seguro de eliminar ensayo del participante:  <strong>${fila.nombreParticipante}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0275d8',
      cancelButtonColor: '#9c9c9c',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ensayoService.eliminarEnsayo(fila.ensayoId).subscribe({
          next: (res) => {
            swall.fire({
              icon: 'success',
              html: `Ensayo eliminado con éxito!`,
            });
            this.dataSource.data = this.dataSource.data.filter((ensayo) => ensayo.ensayoId !== fila.ensayoId);
  
            if (this.dataSource.data.length === 0) {
              this.dataSource = new MatTableDataSource<Ensayo>(); 
            }
            this.dataSource.paginator = this.paginator; 
            this.paginator.firstPage();
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

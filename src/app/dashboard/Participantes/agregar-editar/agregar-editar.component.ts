import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ParticipantesService } from '../services/participantes.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import swall from 'sweetalert2';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-agregar-editar',
  templateUrl: './agregar-editar.component.html',
  styleUrls: ['./agregar-editar.component.css']
})
export class AgregarEditarComponent  implements OnInit{

  participanteForm!: FormGroup
  titulo: string = "Nuevo Participante";
  tituloBoton:string ="Guardar"

  constructor(private formbuilder: FormBuilder,
    private servicio: ParticipantesService,
    @Inject(MAT_DIALOG_DATA) public datoedit : any,
    private dialog : MatDialogRef<AgregarEditarComponent>,
    private datePipe: DatePipe)
  {}

  ngOnInit(): void {

    this.participanteForm = this.formbuilder.group({
      participanteId: [0],
      nmbrs: ['', Validators.required],
      aplld: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      fechaNac: [null, Validators.required],
      correoE: ['', [Validators.required, Validators.email]],
    });

    if (this.datoedit) {
      this.servicio.buscarParticipante(this.datoedit.participanteId).subscribe({
        next: (pa) => {
          this.participanteForm?.patchValue({
            participanteId: pa.participanteId,
            nmbrs: pa.nmbrs,
            aplld: pa.aplld,
            dni: pa.dni,
            fechaNac: pa.fechaNac,
            correoE: pa.correoE,
          });
        }
      });

      this.titulo = "Editar Participante";
      this.tituloBoton = "Actualizar";
    }
  }

  guardarParticipante() {
    if (!this.datoedit && this.participanteForm.valid) {
      this.agregarParticipante();
    } else {
      this.actualizarParticipante();
    }
  }

  private agregarParticipante() {
    this.servicio.agregarParticipante(this.participanteForm.value).subscribe({
      next: (res) => this.mensajeaccion('Se registró correctamente al participante:', res.nmbrs)
    });
  }

  private actualizarParticipante() {
    const id = this.participanteForm.value.participanteId;
    this.servicio.modificarParticipante(id, this.participanteForm.value).subscribe({
      next: (res) => this.mensajeaccion('Se actualizó correctamente al participante:', this.participanteForm.value.nmbrs)
    });
  }

  private mensajeaccion(mensaje: string, nmbrs: string) {
    this.dialog.close();
    swall.fire({
      icon: 'success',
      confirmButtonColor:'#0275d8',
      html: `${mensaje} <strong>${nmbrs}</strong>`
    });
  }



  isValidField(field: string): boolean | null {
    return (
      this.participanteForm.controls[field].errors &&
      this.participanteForm.controls[field].touched
    );
  }

  getFieldError(field: string): string | null {

    if (!this.participanteForm.controls[field]) return null;

    const errors = this.participanteForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return `${field} es requerido`;

        case 'email':
          return `${field} no tiene el formato correcto`;

        case 'pattern':
          return `${field} no tiene los 8 digitos`;
      }
    }
    return null;
  }

}

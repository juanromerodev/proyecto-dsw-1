import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import swall from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { ParticipantesService } from '../../Participantes/services/participantes.service';
import { EnsayosService } from '../services/ensayos.service';

@Component({
  selector: 'app-agregar-editar',
  templateUrl: './agregar-editar.component.html',
  styleUrls: ['./agregar-editar.component.css'],
})
export class AgregarEditarComponent implements OnInit {
  ensayoForm!: FormGroup;
  titulo: string = 'Nuevo Ensayo';
  tituloBoton: string = 'Guardar';
  participantes: any[] = [];

  constructor(
    private formbuilder: FormBuilder,
    private participanteService: ParticipantesService,
    private ensayoService: EnsayosService,
    @Inject(MAT_DIALOG_DATA) public datoedit: any,
    private dialog: MatDialogRef<AgregarEditarComponent>
  ) {}

  ngOnInit(): void {
    this.ensayoForm = this.formbuilder.group({
      ensayoId: [0],
      descripcion: ['', Validators.required],
      participanteId: [0, Validators.required],
      fechaEntrega: [null, Validators.required],
    });

    this.participanteService.listarParticipantes().subscribe((data: any[]) => {
      this.participantes = data;
    });

    if (this.datoedit) {
      this.ensayoService.buscarEnsayo(this.datoedit.ensayoId).subscribe({
        next: (en) => {
          this.ensayoForm?.patchValue({
            ensayoId: en.ensayoId,
            descripcion: en.descripcion,
            participanteId: en.participanteId,
            fechaEntrega: en.fechaEntrega,
          });
        },
      });

      this.titulo = 'Editar Ensayo';
      this.tituloBoton = 'Actualizar';
    }
  }

  guardarEnsayo() {
    if (!this.datoedit && this.ensayoForm.valid) {
      this.agregarEnsayo();
    } else {
      this.actualizarEnsayo();
    }
  }

  agregarEnsayo() {
    this.ensayoService.agregarEnsayo(this.ensayoForm.value).subscribe({
      next: (res) =>
        this.mensajeaccion('Se registró correctamente el ensayo:'),
    });
  }

  actualizarEnsayo() {
    const id = this.ensayoForm.value.ensayoId;
    this.ensayoService.modificarEnsayo(id, this.ensayoForm.value).subscribe({
      next: (res) =>
        this.mensajeaccion('Se actualizó correctamente al ensayo:'),
    });
  }

  private mensajeaccion(mensaje: string) {
    this.dialog.close();
    swall.fire({
      icon: 'success',
      confirmButtonColor: '#0275d8',
      html: `${mensaje}`,
    });
  }

  isValidField(field: string): boolean | null {
    return (
      this.ensayoForm.controls[field].errors &&
      this.ensayoForm.controls[field].touched
    );
  }

  getFieldError(field: string): string | null {
    if (!this.ensayoForm.controls[field]) return null;

    const errors = this.ensayoForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return `${field} es requerido`;
      }
    }
    return null;
  }
}

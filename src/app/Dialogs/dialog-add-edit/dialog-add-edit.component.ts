import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

import { Departamento } from 'src/app/Interfaces/departamento';
import { Empleado } from 'src/app/Interfaces/empleado';
import { DepartamentoService } from '../../Services/departamento.service';
import { EmpleadoService } from 'src/app/Services/empleado.service';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMMYYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMMYYYY'
  }
}

@Component({
  selector: 'app-dialog-add-edit',
  templateUrl: './dialog-add-edit.component.html',
  styleUrls: ['./dialog-add-edit.component.css'],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_DATE_FORMATS
    }
  ]
})
export class DialogAddEditComponent implements OnInit {

  formEmpleado: FormGroup;
  tituloAccion: string = "Nuevo";
  botonAccion: string = "Guardar";
  listaDepartamentos: Departamento[] = [];

  constructor(
    private dialogoReferencia: MatDialogRef<DialogAddEditComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _departamentoServicio: DepartamentoService,
    private _empleadoService: EmpleadoService,
    @Inject(MAT_DIALOG_DATA) public dataEmpleado: Empleado
  ) {

    this.formEmpleado = this.fb.group({
      nombreCompleto: ['', Validators.required],
      idDepartamento: ['', Validators.required],
      sueldo: ['', Validators.required],
      fechaContrato: ['', Validators.required],
    });

    this._departamentoServicio.getList().subscribe({
      next: (dataResponse) => {
        this.listaDepartamentos = dataResponse;
      }, error: (e) => { }
    });

  }

  mostrarAlerta(msg: string, accion: string) {
    this._snackBar.open(msg, accion, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }

  addEditEmpleado() {

    const modelo: Empleado = {
      idEmpleado: 0,
      nombreCompleto: this.formEmpleado.value.nombreCompleto,
      idDepartamento: this.formEmpleado.value.idDepartamento,
      sueldo: this.formEmpleado.value.sueldo,
      fechaContrato: moment(this.formEmpleado.value.fechaContrato).format("DD/MM/YYYY"),
    }

    if (this.dataEmpleado == null) {
      this._empleadoService.add(modelo).subscribe({
        next: (dataResponse) => {
          this.mostrarAlerta("Empleado fue creado", "Listo");
          this.dialogoReferencia.close("creado");
        }, error: (e) => {
          this.mostrarAlerta("Error al crear Empleado", "Error");
        }
      });
    } else {
      this._empleadoService.update(this.dataEmpleado.idEmpleado, modelo).subscribe({
        next: (dataResponse) => {
          this.mostrarAlerta("Empleado fue editado", "Listo");
          this.dialogoReferencia.close("editado");
        }, error: (e) => {
          this.mostrarAlerta("Error al editar Empleado", "Error");
        }
      });
    }
  }

  ngOnInit(): void {
    if (this.dataEmpleado) {
      this.formEmpleado.patchValue({
        nombreCompleto: this.dataEmpleado.nombreCompleto,
        idDepartamento: this.dataEmpleado.idDepartamento,
        sueldo: this.dataEmpleado.sueldo,
        fechaContrato: moment(this.dataEmpleado.fechaContrato, "DD/MM/YYYY"),
      });

      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
  }

}

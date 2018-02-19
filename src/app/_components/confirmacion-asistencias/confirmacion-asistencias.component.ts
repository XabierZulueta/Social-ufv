import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { NotificacionesService } from '../../_services/notificaciones.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogComponent } from '../../_dialogs/dialog-modal/dialog.component';


@Component({
  selector: 'app-confirmacion-asistencias',
  templateUrl: './confirmacion-asistencias.component.html',
  styleUrls: ['./confirmacion-asistencias.component.css']
})
export class ConfirmacionAsistenciasComponent implements OnInit {

  grupos = [];
  procesingRequest = false;
  animal;
  dialogComponent: MatDialogRef<DialogComponent>;

  constructor(private renderer: Renderer2,
    private dialog: MatDialog,
    private notificacionesService: NotificacionesService) {
    this.renderer.removeStyle(
      document.body,
      'background-color'
    );
    this.notificacionesService.getConfirmationEventos().subscribe(data => {
      if (data.success) {
        console.log(data);
        data.grupos.forEach(grupoData => {
          grupoData.eventos.forEach(evento => {
            const confirmed = this.containsConfirmed(evento.go, grupoData.nombre);
            console.log(confirmed);
            if (!confirmed) {
              this.grupos.push(grupoData);
            }
          });
        });
      } else {
        console.log(data);
      }
    });
  }

  openDialog(grupoName, eventoName, personName) {
    this.dialogComponent = this.dialog.open(DialogComponent, {
      width: '450px',
      data: { name: personName }
    });

    this.dialogComponent.afterClosed().subscribe(result => {
      console.log('The dialog was closed ${result}');
      if (!!result && result !== 'false') {
        this.putRequestEvent(grupoName, eventoName, personName, false, result);
      }
    });

  }

  sendDenyToEvent(grupoName, eventoName, personName) {
    this.putRequestEvent(grupoName, eventoName, personName, false);
  }

  sendConfirmToEvent(grupoName, eventoName, personName) {
    this.putRequestEvent(grupoName, eventoName, personName, true);
  }

  private putRequestEvent(grupoName, eventoName, personName, conf, message?) {
    if (typeof conf !== 'boolean') {
      alert('Se ha producido algun fallo');
    } else {
      this.procesingRequest = true;
      this.notificacionesService.putRequestEvent(grupoName, eventoName, personName, conf, message).subscribe(data => {
        if (!data.success) {
          alert('Error al guardar el registro: ' + data.message);
        } else {
          const grupoIndex = this.grupos.findIndex(obj => obj._id === data.grupo._id);
          this.grupos[grupoIndex] = data.grupo;
          setTimeout(() => {
            this.procesingRequest = false;
          }, 2000);
        }
      });
    }
  }

  private containsConfirmed(go, grupoName) {
    let i = 0;
    // Si existe ya el grupo en el array.
    if (this.grupos.findIndex(obj => obj.nombre === grupoName) !== -1) {
      return true;
    }
    for (i = 0; i < go.length; i++) {
      if (!('confirmed' in go[i])) {
        return false;
      }
    }
    return true;
  }

  ngOnInit() {
  }

}

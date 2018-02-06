import { Component, OnInit, Renderer2 } from '@angular/core';
import { NotificacionesService } from '../../_services/notificaciones.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirmacion-asistencias',
  templateUrl: './confirmacion-asistencias.component.html',
  styleUrls: ['./confirmacion-asistencias.component.css']
})
export class ConfirmacionAsistenciasComponent implements OnInit {

  grupos = [];
  procesingRequest = false;

  constructor(
    private notificacionesService: NotificacionesService,
    private renderer: Renderer2,
    private router: Router) {
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
    this.renderer.removeStyle(
      document.body,
      'background-color'
    );
    this.renderer.setStyle(
      document.getElementById('contenido'),
      'box-shadow',
      '0 50px 100px rgba(50, 50, 93, 0.1), 0 15px 35px rgba(50, 50, 93, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1) !important;'
    );
    this.renderer.removeStyle(
      document.getElementById('contenido'),
      'background-color'
    );
  }

  sendDenyToEvent(grupoName, eventoName, personName) {
    console.log('deny');
    this.putRequestEvent(grupoName, eventoName, personName, false);
  }

  sendConfirmToEvent(grupoName, eventoName, personName) {
    this.putRequestEvent(grupoName, eventoName, personName, true);
  }

  private putRequestEvent(grupoName, eventoName, personName, conf) {
    if (typeof conf !== 'boolean') {
      alert('Se ha producido algun fallo');
    } else {
      this.procesingRequest = true;
      this.notificacionesService.putRequestEvent(grupoName, eventoName, personName, conf).subscribe(data => {
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
    console.log(go);
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

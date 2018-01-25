import { Component, OnInit } from '@angular/core';
import { NotificacionesService } from '../../_services/notificaciones.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirmacion-asistencias',
  templateUrl: './confirmacion-asistencias.component.html',
  styleUrls: ['./confirmacion-asistencias.component.css']
})
export class ConfirmacionAsistenciasComponent implements OnInit {

  eventos: Array<any>;

  constructor(
    private notificacionesService: NotificacionesService,
    private router: Router) {
    notificacionesService.getConfirmationEvents().subscribe(data => {
      if (data.success) {
        this.eventos = data.eventos;
        if (this.eventos.length === 0) {
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        }
      }
    });
  }

  ngOnInit() {
  }

}

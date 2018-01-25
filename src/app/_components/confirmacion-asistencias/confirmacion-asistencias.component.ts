import { Component, OnInit } from '@angular/core';
import { NotificacionesService } from '../../_services/notificaciones.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirmacion-asistencias',
  templateUrl: './confirmacion-asistencias.component.html',
  styleUrls: ['./confirmacion-asistencias.component.css']
})
export class ConfirmacionAsistenciasComponent implements OnInit {

  grupos: Array<any>;

  constructor(
    private notificacionesService: NotificacionesService,
    private router: Router) {
    notificacionesService.getConfirmationEvents('Manza').subscribe(data => {
      if (data.success) {
        console.log(data);
        this.grupos = data.grupos;
        // if (this.grupos.length === 0) {
        //   setTimeout(() => {
        //     this.router.navigate(['/']);
        //   }, 2000);
        // }
      }
    });
  }

  ngOnInit() {
  }

}

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class NotificacionesService {

  domain = 'http://localhost:8080/';

  constructor(private http: Http) { }

  getConfirmationEvents(name) {
    return this.http.get(this.domain + 'notificaciones/test/eventos/confirmarAsistencia/' + name).map(res => res.json());
  }

}

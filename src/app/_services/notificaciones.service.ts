import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import { UserService } from './user.service';

@Injectable()
export class NotificacionesService {

  domain = 'http://localhost:8080/';

  constructor(private http: Http,
    private userService: UserService) {

  }

  getConfirmationEventos() {
    const username = this.userService.user.username;
    this.userService.createAuthenticationHeaders();
    return this.http.get(this.domain + 'notificaciones/test/eventos/confirmarAsistencia/' +
      username, this.userService.options).map(res => res.json());
  }

  putRequestEvent(grupoName, eventoName, personName, confirmation) {

    const body = {
      grupo: grupoName,
      evento: eventoName,
      usuario: personName,
      confirmacion: confirmation
    };

    console.log(body);

    const username = this.userService.user.username;
    this.userService.createAuthenticationHeaders();
    return this.http.put(this.domain + 'notificaciones/test/eventos/confirmarAsistencia/',
      body, this.userService.options).map(res => res.json());
  }

}

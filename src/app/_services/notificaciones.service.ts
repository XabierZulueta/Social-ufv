import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import { UserService } from './user.service';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class NotificacionesService {

  domain = this.authService.domain + 'notificaciones/';

  constructor(private http: Http,
    private authService: AuthenticationService) {

  }

  getConfirmationEventos() {
    const username = localStorage.getItem('user');
    this.authService.createAuthenticationHeaders();
    return this.http.get(this.domain + 'eventos/confirmarAsistencia/' +
      username, this.authService.options).map(res => res.json());
  }

  putRequestEvent(grupoName, eventoName, personName, confirmation, message?) {
    const body = {
      grupo: grupoName,
      evento: eventoName,
      usuario: personName,
      confirmacion: confirmation,
      message: message
    };
    console.log(body);
    this.authService.createAuthenticationHeaders();
    return this.http.put(this.domain + 'eventos/confirmarAsistencia/',
      body, this.authService.options).map(res => res.json());
  }

}

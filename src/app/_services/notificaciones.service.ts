import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import { UserService } from './user.service';
import { AuthenticationService } from './index';

@Injectable()
export class NotificacionesService {

  domain = this.authService.domain + 'notificaciones/';

  constructor(private http: Http,
    private authService: AuthenticationService) {

  }

  getConfirmationEventos() {
    const username = this.authService.user.username;
    this.authService.createAuthenticationHeaders();
    return this.http.get(this.domain + 'test/eventos/confirmarAsistencia/' +
      username, this.authService.options).map(res => res.json());
  }

  putRequestEvent(grupoName, eventoName, personName, confirmation) {

    const body = {
      grupo: grupoName,
      evento: eventoName,
      usuario: personName,
      confirmacion: confirmation
    };

    console.log(body);

    const username = this.authService.user.username;
    this.authService.createAuthenticationHeaders();
    return this.http.put(this.domain + 'test/eventos/confirmarAsistencia/',
      body, this.authService.options).map(res => res.json());
  }

}

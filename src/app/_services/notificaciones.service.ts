import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class NotificacionesService {

  domain = 'http://localhost:8080/';

  constructor(private http: Http) { }

  getConfirmationEvents() {
    return this.http.get(this.domain + 'authentication/test/eventos/confirmarAsistencia').map(res => res.json());
  }

}

import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import 'rxjs/add/operator/map';

import { User } from '../usuarios/user';

import { UserService } from '../_services/user.service';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class EventosService {

    domain = this.authService.domain + 'eventos/';
    options;

    constructor(private authService: AuthenticationService,
        private http: Http) { }

    private createAuthenticationHeaders() {
        this.authService.loadToken();
        this.options = new RequestOptions({
            headers: new Headers({
                'content-type': 'application/json',
                'authorization': this.authService.authToken
            })
        });
    }

    apuntarse(idGrupo, evento) {
        const username = localStorage.getItem('user');
        const body = {
            idGrupo: idGrupo,
            evento: evento,
            username: username
        };
        this.createAuthenticationHeaders();
        return this.http.post(this.domain + 'apuntarse', body, this.options).map(res => res.json());
    }

    desapuntarse(idGrupo, evento) {
        const username = localStorage.getItem('user');
        const body = {
            idGrupo: idGrupo,
            evento: evento,
            username: username
        };
        this.createAuthenticationHeaders();
        return this.http.post(this.domain + 'desapuntarse', body, this.options).map(res => res.json());
    }

    getAll() {
        console.log('que pasa?');
        this.createAuthenticationHeaders();
        return this.http.get(this.domain + '', this.options).map(res => res.json());
    }

    addEvento(evento) {
        this.createAuthenticationHeaders();
        return this.http.post(this.domain + evento.idGrupo, evento, this.options).map(res => res.json());
    }
}

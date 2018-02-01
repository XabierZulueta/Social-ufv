import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import 'rxjs/add/operator/map';

import { User } from '../usuarios/user';

import { UserService } from '../_services/user.service';
import { AuthenticationService } from './index';

@Injectable()
export class GruposService {

    domain = this.authService.domain + 'grupos/';
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

    getAll() {
        this.createAuthenticationHeaders();
        return this.http.get(this.domain + 'allGrupos', this.options).map(res => res.json());
    }

    newGrupo(newGrupo) {
        this.createAuthenticationHeaders();
        console.log(newGrupo);
        return this.http.post(this.domain + 'grupo', newGrupo, this.options).map(res => res.json());
    }

    getById(id) {
        this.createAuthenticationHeaders();
        return this.http.get(this.domain + 'getGrupo/' + id, this.options).map(res => res.json());
    }

    addEvento() {
        const idGrupo = '5a7344711547e1263a4ec4cf';
        const dateString = '2018-02-15T00:00:00';
        const newDate = new Date(dateString);
        const evento = {
            evento: {
                title: 'Puues tenemos otro evento',
                start: Date.now(),
                administrador: 'this.username',
                end: newDate
            }
        };
        console.log(evento);
        console.log('Pues si pues no al escondite ingles.');
        this.createAuthenticationHeaders();
        return this.http.post(this.domain + 'grupo/' + idGrupo + '/addEvento', evento, this.options).map(res => res.json());
    }
}

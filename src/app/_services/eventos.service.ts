import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import 'rxjs/add/operator/map';

import { User } from '../usuarios/user';

import { UserService } from '../_services/user.service';

@Injectable()
export class EventosService {

    domain = this.userService.domain + 'eventos/';
    options;

    constructor(private userService: UserService,
        private http: Http) { }

    private createAuthenticationHeaders() {
        this.userService.loadToken();
        this.options = new RequestOptions({
            headers: new Headers({
                'content-type': 'application/json',
                'authorization': this.userService.authToken
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
        this.createAuthenticationHeaders();
        return this.http.get(this.domain + '', this.options).map(res => res.json());
    }

    // newGrupo(newGrupo) {
    //     this.createAuthenticationHeaders();
    //     return this.http.post(this.domain + '', newGrupo, this.options).map(res => res.json());
    // }

    // getById(id) {
    //     this.createAuthenticationHeaders();
    //     return this.http.get(this.domain + '' + id, this.options).map(res => res.json());
    // }
}

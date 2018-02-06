import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import 'rxjs/add/operator/map';

import { User } from '../usuarios/user';

import { UserService } from '../_services/user.service';
import { AuthenticationService } from './authentication.service';

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
        return this.http.get(this.domain + '', this.options).map(res => res.json());
    }

    newGrupo(newGrupo) {
        this.createAuthenticationHeaders();
        return this.http.post(this.domain + '', newGrupo, this.options).map(res => res.json());
    }

    getById(id) {
        this.createAuthenticationHeaders();
        return this.http.get(this.domain + id, this.options).map(res => res.json());
    }

    // addEvento(idGrupo, evento) {
    //     console.log(evento);
    //     this.createAuthenticationHeaders();
    //     return this.http.post(this.domain + idGrupo + '/addEvento', evento, this.options).map(res => res.json());
    // }
}

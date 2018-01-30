import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import 'rxjs/add/operator/map';

import { User } from '../usuarios/user';

import { UserService } from '../_services/user.service';
import { AuthenticationService } from './index';

@Injectable()
export class GruposService {

    domain = this.authService.domain;
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
        return this.http.get(this.domain + 'grupos/', this.options).map(res => res.json());
    }

    newGrupo(newGrupo) {
        this.createAuthenticationHeaders();
        return this.http.post(this.domain + 'grupos/', newGrupo, this.options).map(res => res.json());
    }

    getById(id) {
        this.createAuthenticationHeaders();
        return this.http.get(this.domain + 'grupos/' + id, this.options).map(res => res.json());
    }
}

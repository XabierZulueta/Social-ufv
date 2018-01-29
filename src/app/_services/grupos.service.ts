import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import 'rxjs/add/operator/map';

import { User } from '../usuarios/user';

import { UserService } from '../_services/user.service';

@Injectable()
export class GruposService {

    domain = this.userService.domain;
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

    getAll() {
        return this.http.get(this.domain + 'grupos/', this.options).map(res => res.json());
    }

    newGrupo(newGrupo) {
        this.createAuthenticationHeaders();
        return this.http.post(this.domain + 'grupos/', newGrupo, this.options).map(res => res.json());
    }
}

import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import 'rxjs/add/operator/map';

import { User } from '../usuarios/user';


import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class UserService {

    domain = 'http://localhost:8080/';
    authToken;
    user;
    options;

    constructor(private http: Http) { }

    createAuthenticationHeaders() {
        this.loadToken();
        this.options = new RequestOptions({
            headers: new Headers({
                'content-type': 'application/json',
                'authorization': this.authToken
            })
        });
    }

    loadToken() {
        this.authToken = localStorage.getItem('token');
    }

    registerUser(user) {
        return this.http.post(this.domain + 'authentication/register', user).map(res => res.json());
    }

    checkEmail(email) {
        return this.http.get(this.domain + 'authentication/checkEmail/' + email).map(res => res.json());
    }

    checkUsername(username) {
        return this.http.get(this.domain + 'authentication/checkUsername/' + username).map(res => res.json());
    }

    login(user) {
        return this.http.post(this.domain + 'authentication/login', user).map(res => res.json());
    }

    logout() {
        this.authToken = null;
        this.user = null;
        localStorage.clear();
    }

    storeData(token, user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.authToken = token;
        this.user = user;
    }

    getProfile() {
        this.createAuthenticationHeaders();
        return this.http.get(this.domain + 'authentication/profile', this.options).map(res => res.json());
    }

    loggedIn() {
        return tokenNotExpired();
    }

    ///ALL XABIS FUNCTIONS
    getAll() {
        return this.http.get('/api/users', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(user: User) {
        return this.http.post('/api/users', user, this.jwt()).map((response: Response) => response.json());
    }

    update(user: User) {
        return this.http.put('/api/users/' + user.id, user, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            const headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }
}
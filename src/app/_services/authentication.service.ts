import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { UserService } from './user.service';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthenticationService {

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
        localStorage.setItem('user', user.username);
        localStorage.setItem('role', user.role);
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

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    activateAccount(token) {
        return this.http.put(this.domain + 'authentication/activate/' + token, null).map(res => res.json());
    }

    resend(user) {
        return this.http.post(this.domain + 'authentication/resend', user).map(res => res.json());
    }

    resetUsername(email) {
        return this.http.get(this.domain + 'authentication/reset/username/' + email).map(res => res.json());
    }

    resetPassword(username) {
        const body = {
            username: username
        };
        return this.http.put(this.domain + 'authentication/reset/password', body).map(res => res.json());
    }

    savePasswords(username, password) {
        const body = {
            username: username,
            password: password
        };
        return this.http.put(this.domain + 'authentication/save/password', body).map(res => res.json());
    }

    getUserResetPassword(token) {
        return this.http.get(this.domain + 'authentication/reset/password/' + token).map(res => res.json());
    }
}

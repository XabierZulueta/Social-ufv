import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {

    private authenticate = new Subject<boolean>();
    authenticateState$ = this.authenticate.asObservable();

    constructor(private http: Http) { }

    register(username: string, password:string){
        return this.http.post("/api/register", { username: username, password: password })
            .toPromise()
            .catch(this.handleError);
    }

    login(username: string, password: string):Observable<any> {
        return this.http.post("/api/authenticate", { username: username, password: password })
            .map(res=>
                res.json());
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    logout() {
        // remove user from local storage to log user out
        // localStorage.removeItem('token');
        // localStorage.clear();
        this.authenticate.next(false);
    }

    saveToken(token: string) {
        // localStorage.removeItem('token');
        // localStorage.setItem('token',token);
        this.authenticate.next(true);
    }

    isAuthenticate(): boolean {
        return true;
        // let isAuth: boolean;
        // if (localStorage.getItem('token')) {
        //     isAuth = true;
        // } else {
        //     isAuth = false;
        // }
        // return isAuth;
    }
}

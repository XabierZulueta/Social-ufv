import { Injectable } from '@angular/core';
import { DayPilot } from 'daypilot-pro-angular';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

    result: any;

    constructor(private _http: Http) {
     }

    getUsers() {
        return this._http.get("/api/users")
            .map(result => this.result = result.json().data);
    }

    getUserById(idUser) {
        return this._http.get("/api/"+idUser)
            .map(result => this.result = result.json().data);
    }

    getGroups(){
        return this._http.get("/api/groups")
            .map(result => this.result = result.json().data);
    }

    getGroup(idGrupo) {
        return this._http.get("/api/groups/" + idGrupo)
            .map(result => this.result = result.json().data);
    }

    events: any[] = [
        {
            id: "1",
            start: "2017-06-05T00:00:00",
            end: "2017-06-08T00:00:00",
            text: "Event 1"
        }
    ];
    getEvents(from: DayPilot.Date, to: DayPilot.Date): Observable<any[]> {

        // simulating an HTTP request
        return new Observable(observer => {
            setTimeout(() => {
                observer.next(this.events);
            }, 200);
        });

        // return this.http.get("/api/events?from=" + from.toString() + "&to=" + to.toString()).map((response:Response) => response.json());
    }

    getEventos(){
        return this._http.get("/api/events/")
            .map(result => this.result = result.json().data);
    }

}
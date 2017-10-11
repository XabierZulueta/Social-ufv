import { Injectable } from '@angular/core';
import { DayPilot } from 'daypilot-pro-angular';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Evento } from './eventos/evento';

@Injectable()
export class DataService {
    
    result: any;
    events : any[];
    private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
    private options = new RequestOptions({ headers: this.headers });
    constructor(private _http: Http) {
     }

    getMaxId(){
         return this._http.get("/api/users/max")
             .map(result => this.result = result.json().data);
    }

    getEventMaxId(){
         return this._http.get("/api/events/max")
             .map(result => this.result = result.json().data);
    }
    
    getGroupMaxId(){
        return this._http.get("/api/groups/max")
            .map(result => this.result = result.json().data);
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

    /*events: any[] = [
        {
            id: "1",
            start: "2017-06-05T00:00:00",
            end: "2017-06-08T00:00:00",
            text: "Event 1"
        }
    ];*/
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

    getEventosGrupo(idGrupo){
        return this._http.get("/api/events/" + idGrupo)
            .map(result => this.result = result.json().data);
    }

    addUser(nombre:string, id:number) : Promise<any>{
        return this._http.post("/api/users", JSON.stringify({ id: id, name: nombre, grupos:[] }), { headers: this.headers })
        .toPromise()
        .catch(this.handleError);
       /*     .toPromise()
            .then(res => { res.id=i, nombre: nombr })
            .catch(this.handleError)  ;  */
        //.subscribe();
            //.map(this.extractData)
        //return this._http.post("/api/xabi", JSON.stringify({ id: 3, nombre: "Carlos" })).map(response => response.json());
    }

    updateUser(u:any){
        return this._http.post("/api/users", JSON.stringify(u), { headers: this.headers })
            .toPromise()
            .catch(this.handleError);
    }

    deleteUser(id:number){
        return this._http.delete("/api/users/"+id,{ headers: this.headers }).toPromise()
            .catch(this.handleError);
    }

    addEvent(event:Evento){
        return this._http.post("/api/events", JSON.stringify(event), { headers: this.headers })
            .toPromise()
            .catch(this.handleError);
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
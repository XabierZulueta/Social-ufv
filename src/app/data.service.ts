import { Injectable } from '@angular/core';
import { DayPilot } from 'daypilot-pro-angular';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Evento } from './eventos/evento';
import { Grupo } from './grupos/grupo';

@Injectable()
export class DataService {
    
    result: any;
    events : any[];
    private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
    private options = new RequestOptions({ headers: this.headers });
    constructor(private _http: Http) {
     }

    getMaxId(db){
         return this._http.get("/api/"+db+"/max")
             .map(result => this.result = result.json().data);
    }
     
    getGeneral(db){
        return this._http.get("/api/"+db)
            .map(result => this.result = result.json().data);
    }

    getById(id, db){
        return this._http.get("/api/"+db+"/" + id)
            .map(result => this.result = result.json().data);
    }

    getEvents(from: DayPilot.Date, to: DayPilot.Date): Observable<any[]> {

        // simulating an HTTP request
        return new Observable(observer => {
            setTimeout(() => {
                observer.next(this.events);
            }, 200);
        });

        // return this.http.get("/api/events?from=" + from.toString() + "&to=" + to.toString()).map((response:Response) => response.json());
    }

    addUser(nombre:string, id:number) : Promise<any>{
        return this._http.post("/api/users", JSON.stringify({ id: id, name: nombre, grupos:[] }), { headers: this.headers })
        .toPromise()
        .catch(this.handleError);
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

    addGroup(group: Grupo) {
        return this._http.post("/api/groups", JSON.stringify(group), { headers: this.headers })
            .toPromise()
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }


}
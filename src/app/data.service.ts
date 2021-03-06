import { Injectable } from '@angular/core';
import { DayPilot } from 'daypilot-pro-angular';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { Evento } from './eventos/evento';
import { Grupo } from './grupos/grupo';
import { UserService } from './_services/user.service';

@Injectable()
export class DataService {

    domain = this.userService.domain;

    result: any;
    events: any[];
    private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
    private options = new RequestOptions({ headers: this.headers });
    constructor(
        private userService: UserService,
        private _http: Http) {
    }

    getMaxId(db) {
        return this._http.get(this.domain + 'api/' + db + '/max')
            .map(result => this.result = result.json().data);
    }

    getGeneral(db) {
        return this._http.get(this.domain + 'api/' + db)
            .map(result => this.result = result.json().data);
    }

    getById(id, db) {
        return this._http.get(this.domain + 'api/' + db + '/' + id)
            .map(result => this.result = result.json().data);
    }

    getEvents(from: DayPilot.Date, to: DayPilot.Date): Observable<any[]> {

        // simulating an HTTP request
        return new Observable(observer => {
            setTimeout(() => {
                observer.next(this.events);
            }, 200);
        });

        // return this.http.get(this.domain + 'api/events?from=' + from.toString() + '&to=' + to.toString()).map((response:Response) => response.json());
    }

    addUser(nombre: string, id: number): Promise<any> {
        return this._http.post(this.domain + 'api/users', JSON.stringify({ id: id, name: nombre, grupos: [] }), { headers: this.headers })
            .toPromise()
            .catch(this.handleError);
    }

    updateUser(u: any) {
        return this._http.post(this.domain + 'api/users', JSON.stringify(u), { headers: this.headers })
            .toPromise()
            .catch(this.handleError);
    }

    deleteUser(id: number) {
        return this._http.delete(this.domain + 'api/users/' + id, { headers: this.headers }).toPromise()
            .catch(this.handleError);
    }

    addEvent(event: Evento) {
        return this._http.post(this.domain + 'api/events', JSON.stringify(event), { headers: this.headers })
            .toPromise()
            .catch(this.handleError);
    }

    addGroup(group: Grupo) {
        return this._http.post(this.domain + 'api/groups', JSON.stringify(group), { headers: this.headers })
            .toPromise()
            .catch(this.handleError);
    }

    getNUsers(id) {
        return this._http.get(this.domain + 'api/grupo/' + id + '/nusers')
            .map(result => this.result = result.json().data);
    }

    getNPeticiones(id) {
        return this._http.get(this.domain + 'api/grupo/' + id + '/npeticiones')
            .map(result => this.result = result.json().data);
    }

    esMiembro(idGrupo, idUsuario) {
        return this._http.get(this.domain + 'api/user/miembro/' + idUsuario + '/' + idGrupo)
            .map(result => this.result = result.json().data);
    }

    esperando(idGrupo, idUsuario) {
        return this._http.get(this.domain + 'api/peticiones/miembro/' + idUsuario + '/' + idGrupo)
            .map(result => this.result = result.json().data);
    }

    esApuntado(idEvento, idUsuario) {
        return this._http.get(this.domain + 'api/user/apuntado/' + idUsuario + '/' + idEvento)
            .map(result => this.result = result.json().data);
    }

    desapuntarGrupo(idUsuario, idGrupo) {
        return this._http.post(this.domain + 'api/desapuntar/' + idUsuario + '/' + idGrupo, { headers: this.headers })
            .toPromise()
            .catch(this.handleError);
    }

    apuntarGrupo(peticion) {
        return this._http.post(this.domain + 'api/peticiones', JSON.stringify(peticion), { headers: this.headers })
            .toPromise()
            .catch(this.handleError);
    }

    desapuntarEvento(idUsuario, idEvento) {
        return this._http.post(this.domain + 'api/desapuntarEvento/' + idUsuario + '/' + idEvento, { headers: this.headers })
            .toPromise()
            .catch(this.handleError);
    }

    apuntarEvento(idUsuario, idEvento) {
        return this._http.post(this.domain + 'api/apuntarEvento/' + idUsuario + '/' + idEvento, { headers: this.headers })
            .toPromise()
            .catch(this.handleError);
    }

    getLike(db: string, nombre: String) {
        return this._http.get(this.domain + 'api/' + db + '/nombre/' + nombre, { headers: this.headers })
            .map(result => this.result = result.json().data);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    deletePeticion(id) {
        return this._http.delete(this.domain + 'api/peticiones/' + id, { headers: this.headers }).toPromise()
            .catch(this.handleError);
    }

    insertPeticion(peticion) {
        return this._http.post(this.domain + 'api/peticiones', JSON.stringify(peticion), { headers: this.headers })
            .toPromise()
            .catch(this.handleError);
    }

    aceptarPeticion(idUsuario, idGrupo) {
        return this._http.post(this.domain + 'api/apuntar/' + idUsuario + '/' + idGrupo, { headers: this.headers })
            .toPromise()
            .catch(this.handleError);
    }

    searchTags(tags) {
        const params: URLSearchParams = new URLSearchParams();

        return this._http.get(this.domain + 'api/groups/tags', { headers: this.headers, search: tags })
            .map(result => this.result = result.json().data);
    }

    getUltimoEvento(idUsuario) {
        return this._http.get(this.domain + 'api/ultimoEvento/' + idUsuario, { headers: this.headers })
            .map(result => this.result = result.json().data);
    }

}

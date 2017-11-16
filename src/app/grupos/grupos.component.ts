import { Component } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'grupos',
    templateUrl: './grupos.component.html',
    styleUrls: ['../app.component.css']
})

export class GruposComponent {
    grupos: Array<any>;
    grupo:any;
    nombre : String;
    isLogged:any;
    // Create an instance of the DataService through dependency injection
    constructor(private _dataService: DataService, private authService: AuthenticationService,
    private router : Router) {
        this.isLogged = this.authService.isAuthenticate();
        if (this.isLogged == false) {
            this.router.navigateByUrl('/login');
        }
        this._dataService.getGeneral('groups')
            .subscribe(res => this.grupos = res);
    }
    
    search(nombre:any){
        if (nombre.length==0)
            this._dataService.getGeneral('groups')
                .subscribe(res => this.grupos = res);
        else{
            this._dataService.getLike('groups', nombre)
                .subscribe(res => this.grupos = res);
        }
    }
/*
    getGroupUsers(idGrupo) {
        this._dataService.getUserByGroup(idGrupo)
            .subscribe(res => this.grupo = res);
    }*/
}
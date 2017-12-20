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
    gruposTotal:Array<any>;
    gruposTag : Array<any>;
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
    
    search(nombre){
        if(!this.gruposTotal)
            this.gruposTotal = this.grupos;
        if(nombre.length != 0){
        this.grupos = this.gruposTotal.filter(grupo =>
        grupo.nombre.toUpperCase().includes(nombre.toUpperCase())) ;
        this.gruposTag = this.gruposTotal.filter(grupo =>
            grupo.imagen.toUpperCase().includes(nombre.toUpperCase()));
            //en vez de imagen serían los tags.
        for(var i = 0; i< this.gruposTag.length;i++){
            if(this.grupos.indexOf(this.gruposTag[i])==-1)
                this.grupos.push(this.gruposTag[i]);
        }
        this.grupos.sort(function(a,b){
            return (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0);
        });
        }
        else{
            this.grupos = this.gruposTotal;
        }

    }

}
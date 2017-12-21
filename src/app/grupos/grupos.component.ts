import { Component } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { fadeInAnimation } from '../_animations/index';
import { PagerService } from '../_services/index';

@Component({
    selector: 'grupos',
    templateUrl: './grupos.component.html',
    styleUrls: ['../app.component.css'],animations: [fadeInAnimation],
 
    // attach the fade in animation to the host (root) element of this component
    host: { '[@fadeInAnimation]': '' },
})

export class GruposComponent implements OnInit {
    grupos: Array<any>;
    gruposTotal:Array<any>;
    gruposTag : Array<any>;
    grupo:any;
    nombre : String;
    isLogged:any;
    isLoading:boolean;
    pager: any = {};

    // paged items
    pagedItems: any[];
    // Create an instance of the DataService through dependency injection
    constructor(private _dataService: DataService, private authService: AuthenticationService,
    private router : Router, private pagerService: PagerService) {
        
    }
    

    ngOnInit(){
        this.isLoading=true;
        this.isLogged = this.authService.isAuthenticate();
        if (this.isLogged == false) {
            this.router.navigateByUrl('/login');
        }
        this._dataService.getGeneral('groups')
            .subscribe(res => {this.grupos = res;
                this.setPage(1);});
        this.isLoading=false;
    }

    search(nombre){
        this.isLoading=true;
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
        this.isLoading=false;
        this.setPage(1);
    }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        // get pager object from service
        this.pager = this.pagerService.getPager(this.grupos.length, page);

        // get current page of items
        this.pagedItems = this.grupos.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

}
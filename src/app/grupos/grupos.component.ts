import { Component } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { fadeInAnimation } from '../_animations/index';
import { PagerService } from '../_services/index';
import { Tags } from '../tags/tags';
import {MatCheckboxModule } from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'grupos',
    templateUrl: './grupos.component.html',
    styleUrls: ['../app.component.css'],animations: [fadeInAnimation],
 
    // attach the fade in animation to the host (root) element of this component
    host: { '[@fadeInAnimation]': '' },
})

export class GruposComponent implements OnInit {
    grupos: Array<any>;
    tags: Array<Tags>;
    gruposTotal: Array<any>;
    gruposTag: Array<any>;
    grupo: any;
    nombre: String;
    isLogged: any;
    isLoading: boolean;
    pager: any = {};
    tagschecked: Array<any>;

    // paged items
    pagedItems: any[];
    // Create an instance of the DataService through dependency injection
    constructor(private _dataService: DataService, private authService: AuthenticationService,
    private router : Router, private pagerService: PagerService) {
        this.tagschecked=[];
        this.gruposTotal=[];
        this.gruposTag=[];
    }
    

    ngOnInit() {
        // this.isLoading=true;
        // this.isLogged = this.authService.isAuthenticate();
        // if (this.isLogged == false) {
        //     this.router.navigateByUrl('/login');
        // }

        // this._dataService.getGeneral('groups')
        //     .subscribe(res => {this.isLoading=false;
        //         this.grupos = res;
        //         this.setPage(1);});
        // this._dataService.getGeneral('tags').subscribe(res => {this.tags = res;})
    }

    search(nombre){
        var grupo = null;
        var valor;
        
        if(this.gruposTotal.length==0)
            this.gruposTotal = this.grupos;

            this.grupos = [];
        this.grupos = this.gruposTotal;

        if(nombre.length != 0 && this.tagschecked.length==0){
            this.grupos = this.gruposTotal.filter(grupo =>
            grupo.nombre.toUpperCase().includes(nombre.toUpperCase())) ;
        }
        else if (this.tagschecked.length>0 && nombre.length == 0){
            for(let g of this.grupos){
               if(this.arrayContainsArray(g.tags, this.tagschecked)){
                   if(this.gruposTag.indexOf(g)==-1)
                    this.gruposTag.push(g);
               }
               if(!this.arrayContainsArray(g.tags, this.tagschecked)){
                   this.gruposTag.splice(this.gruposTag.indexOf(g),1);
               }
            }
            this.grupos =  this.gruposTag;
        }
        else if(this.tagschecked.length>0 && nombre.length != 0){
            this.grupos = this.gruposTotal.filter(grupo =>
                grupo.nombre.toUpperCase().includes(nombre.toUpperCase())) ;  
            if(this.grupos.length>0){
                this.gruposTag=[];
                for(let g of this.grupos){
                    if(this.arrayContainsArray(g.tags, this.tagschecked)){
                        if(this.gruposTag.indexOf(g)==-1)
                            this.gruposTag.push(g);
                    }
                    if(!this.arrayContainsArray(g.tags, this.tagschecked)){
                        this.gruposTag.splice(this.gruposTag.indexOf(g),1);
                    }
                }
            this.grupos =  this.gruposTag;
            }
        }
        else{
        }
        this.grupos.sort(function(a,b){
            return (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0);
        });

        this.setPage(1);
    }

    arrayContainsArray(superset, subset){
        if (0 === subset.length) {
            return false;
          }
          return subset.every(function (value) {
            return (superset.indexOf(value) >= 0);
          });
    }

    setPage(page: number) {
        if (page < 1 || page > this.grupos.length) {
            this.pagedItems = this.grupos;
            this.pager=[];
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.grupos.length, page);

        // get current page of items
        this.pagedItems = this.grupos.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    checkear(event, nombre){
        var index = this.tagschecked.indexOf(+event.source.value); 
        if(index == -1)
        {
            this.tagschecked.push(+event.source.value);
        }
        else{
            this.tagschecked.splice(index,1);
        }

        this.search(nombre);
    }

    checkear2(value,nombre){
        var index = this.tagschecked.indexOf(+value); 
        if(index == -1)
        {
            this.tagschecked.push(+value);
        }
        else{
            this.tagschecked.splice(index,1);
        }

        this.search(nombre);
    }

}
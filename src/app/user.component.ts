import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';
import { ActivatedRoute } from '@angular/router';

import { Grupo } from './grupo';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    styleUrls: ['./app.component.css']
})

export class UserComponent implements OnInit{
    user: any;
    grupos : boolean;
    gruposid : Array<any>;
    id:number;

    constructor(private _dataService: DataService,
        private route: ActivatedRoute) {
    }

    ngOnInit(){
        var sub = this.route.params.subscribe(params => {
            this.id = +params['id']; // (+) converts string 'id' to a number
            // In a real app: dispatch action to load the details here.
        });
        this._dataService.getUserById(this.id)
            .subscribe(res => {
            this.user = res;
            });
        this.grupos = false;
        this.gruposid = new Array<any>();
    }

    onSelect(user): void {
        var n = user.grupos.length;
        var g = Array<any>();
        if(this.gruposid.length==0){
            this.gruposid=user.grupos;
        }
        if(this.grupos == false){
            g = this.gruposid;
            user.grupos = new Array<Grupo>();
            for(var i=1; i< n+1;i++){
                this._dataService.getGroup(g[i - 1])
                    .subscribe(res => {
                        user.grupos.push(res);
                    });
            }
            this.grupos=true;
        }
        else{
            this.grupos=false;
        }
    }
}
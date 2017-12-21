import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { Grupo } from '../grupos/grupo';
import { fadeInAnimation } from '../_animations/index';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    styleUrls: ['../app.component.css'],
    animations: [fadeInAnimation],
    host: { '[@fadeInAnimation]': '' }
})

export class UserComponent implements OnInit{
    user: any;
    grupos : boolean;
    gruposid : Array<any>;
    id:number;
    isLogged:any;

    constructor(private _dataService: DataService,
        private route: ActivatedRoute, private authService: AuthenticationService,
    private router: Router) {
    }

    ngOnInit(){
        this.isLogged = this.authService.isAuthenticate();
        if (this.isLogged == false) {
            this.router.navigateByUrl('/login');
        }
        var sub = this.route.params.subscribe(params => {
            this.id = +params['id']; // (+) converts string 'id' to a number
            // In a real app: dispatch action to load the details here.
        });
        this._dataService.getById(this.id, '')
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
                this._dataService.getById(g[i - 1],'groups')
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
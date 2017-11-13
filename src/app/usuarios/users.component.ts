import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import{User} from './user';
import { ActivatedRoute, Router,  } from '@angular/router';
import { Subject } from 'rxjs/Subject';


@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    styleUrls: ['../app.component.css']
})

export class UsersComponent implements OnInit{
    users: Array<any>;
    user: any;
    grupos: Array<any>;
    usuario : User;
    idMax: number;
    userMaxId : Array<User>;
    nombre : String = '';
    nrows:number;
    url: String ;

    // Create an instance of the DataService through dependency injection
    constructor(private _dataService: DataService, private route: ActivatedRoute, private router: Router) {
       /* this.nombre='';
        this.ngOnInit();*/
    }

    ngOnInit(){
        // Access the Data Service's getUsers() method we defined
       /* if (this.nombre.length==0)
        this._dataService.getGeneral('users')
            .subscribe(res => { this.users = res;
                this.nrows = this.users.length; });
        else
        this._dataService.getLike('users',this.nombre)
            .subscribe(res => { this.users = res;
            this.nrows=this.users.length; });*/
        this._dataService.getMaxId('users')
            .subscribe(res => {
                this.userMaxId = res;
            });
    }

    getUserById(idUser) {
        this._dataService.getById(idUser,'')
            .subscribe(res => this.user = res);
    }

    add(nombre: string, id: number){
        this._dataService.addUser(nombre,id);
        this.ngOnInit();
    }

    delete(id:number){
        this._dataService.deleteUser(id);
        this.ngOnInit();
    }

    search(nombre:string){
        this.nombre = nombre;
        this.ngOnInit();
    }
 /*   getGroupUsers(idGrupo) {
        this._dataService.getUserByGroup(idGrupo)
            .subscribe(res => this.user = res);
    }*/
}
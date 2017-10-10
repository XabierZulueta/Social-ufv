import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';
import{User} from './user';

@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    styleUrls: ['./app.component.css']
})

export class UsersComponent implements OnInit{
    users: Array<any>;
    user: any;
    grupos: Array<any>;
    usuario : User;
    idMax: number;
    prueba : Array<User>;

    // Create an instance of the DataService through dependency injection
    constructor(private _dataService: DataService) {

       

    }

    ngOnInit(){
        // Access the Data Service's getUsers() method we defined
        this._dataService.getUsers()
            .subscribe(res => { this.users = res; });
        this._dataService.getMaxId()
            .subscribe(res => {
                this.prueba = res;
            });
    }

    getUserById(idUser) {
        this._dataService.getUserById(idUser)
            .subscribe(res => this.user = res);
    }

    add(nombre: string, id: number){
        this._dataService.addUser(nombre,id);
        
    }
 /*   getGroupUsers(idGrupo) {
        this._dataService.getUserByGroup(idGrupo)
            .subscribe(res => this.user = res);
    }*/
}
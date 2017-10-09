import { Component } from '@angular/core';
import { DataService } from './data.service';

@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    styleUrls: ['./app.component.css']
})

export class UsersComponent {
    users: Array<any>;
    user: any;
    grupos: Array<any>;

    // Create an instance of the DataService through dependency injection
    constructor(private _dataService: DataService) {

        // Access the Data Service's getUsers() method we defined
        this._dataService.getUsers()
            .subscribe(res => { this.users = res ;});


    }

    getUserById(idUser) {
        this._dataService.getUserById(idUser)
            .subscribe(res => this.user = res);
    }

 /*   getGroupUsers(idGrupo) {
        this._dataService.getUserByGroup(idGrupo)
            .subscribe(res => this.user = res);
    }*/
}
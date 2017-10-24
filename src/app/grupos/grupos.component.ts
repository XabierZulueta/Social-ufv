import { Component } from '@angular/core';

import { DataService } from '../data.service';

@Component({
    selector: 'grupos',
    templateUrl: './grupos.component.html',
    styleUrls: ['../app.component.css']
})

export class GruposComponent {
    grupos: Array<any>;
    grupo:any;
    // Create an instance of the DataService through dependency injection
    constructor(private _dataService: DataService) {
        this._dataService.getGeneral('groups')
            .subscribe(res => this.grupos = res);
    }
/*
    getGroupUsers(idGrupo) {
        this._dataService.getUserByGroup(idGrupo)
            .subscribe(res => this.grupo = res);
    }*/
}
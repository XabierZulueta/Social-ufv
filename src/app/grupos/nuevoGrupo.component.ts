import { Component } from '@angular/core';

import { DataService } from '../data.service';
import { ActivatedRoute } from '@angular/router';

const colors: any = {
    red: {
        primary: '#ad2121',
        secondary: '#FAE3E3'
    },
    blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
    },
    yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA'
    }
};

@Component({
    selector: 'nuevoGrupo',
    templateUrl: './nuevoGrupo.component.html',
    styleUrls: ['./grupo.component.css']
})

export class GrupoComponent {
    maxId:Array<any>;
    grupo: any;
    // Create an instance of the DataService through dependency injection
    constructor(private _dataService: DataService,
        private route: ActivatedRoute) {
        this._dataService.getGroupMaxId().subscribe(res => {
            this.maxId = res;
            this.grupo.id = this.maxId[0].id + 1;
        });
    }
}
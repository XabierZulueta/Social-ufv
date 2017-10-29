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
    selector: 'grupos',
    templateUrl: './grupo.component.html',
    styleUrls: ['./grupo.component.css']
})

export class GrupoComponent {
    grupo: any;
    id:number;
    eventos : any[];
    miembros:any[];
    nusers:number;

    // Create an instance of the DataService through dependency injection
    constructor(private _dataService: DataService,
        private route: ActivatedRoute) {
            var sub= this.route.params.subscribe(params => {
            this.id = +params['id']; // (+) converts string 'id' to a number

            // In a real app: dispatch action to load the details here.
        });
        this._dataService.getById(this.id,'groups')
            .subscribe(res => this.grupo = res);
        this._dataService.getById(this.id,'events')
            .subscribe(res => {
                this.eventos = res;
                for (var i = 0; i < this.eventos.length; i++) {
                    this.eventos[i].start = new Date(new Date(this.eventos[i].start).toUTCString());
                    this.eventos[i].end = new Date(new Date(this.eventos[i].end).toUTCString());
                    this.eventos[i].color = colors.blue;
                }
                console.log(this.eventos);
            });
        this._dataService.getById(this.id,'users/grupo')
            .subscribe(res=>this.miembros = res);

        this._dataService.getNUsers(this.id)
            .subscribe(res=>this.nusers = res);
    }
}
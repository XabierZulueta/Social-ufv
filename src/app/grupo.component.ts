import { Component } from '@angular/core';

import { DataService } from './data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'grupos',
    templateUrl: './grupo.component.html',
    styleUrls: ['./grupo.component.css']
})

export class GrupoComponent {
    grupo: any;
    id:number;

    // Create an instance of the DataService through dependency injection
    constructor(private _dataService: DataService,
        private route: ActivatedRoute) {
            var sub= this.route.params.subscribe(params => {
            this.id = +params['id']; // (+) converts string 'id' to a number

            // In a real app: dispatch action to load the details here.
        });
        this._dataService.getGroup(this.id)
            .subscribe(res => this.grupo = res);
    }
}
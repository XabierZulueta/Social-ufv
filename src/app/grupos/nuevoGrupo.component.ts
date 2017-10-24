import { Component } from '@angular/core';

import { DataService } from '../data.service';
import { ActivatedRoute } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';

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
        this._dataService.getMaxId('groups').subscribe(res => {
            this.maxId = res;
            this.grupo.id = this.maxId[0].id + 1;
        });
    }

    public uploader: FileUploader = new FileUploader({ url: 'http://localhost:3000/api/fotos/' });
    public hasBaseDropZoneOver: boolean = false;
    public hasAnotherDropZoneOver: boolean = false;

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    public fileOverAnother(e: any): void {
        this.hasAnotherDropZoneOver = e;
    }
}
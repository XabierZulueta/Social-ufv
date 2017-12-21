import { Component, ViewChild } from '@angular/core';

import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Http } from '@angular/http';
import { FileUploader } from 'ng2-file-upload';
import { Ng2FileInputService, Ng2FileInputAction } from 'ng2-file-input';
import { Grupo } from './grupo';
import { FancyImageUploaderOptions, UploadedFile } from 'ng2-fancy-image-uploader';
import { AuthenticationService } from '../_services/authentication.service';
import { fadeInAnimation } from '../_animations/index';

@Component({
    selector: 'nuevoGrupo',
    templateUrl: './nuevoGrupo.component.html',
    styleUrls: ['./grupo.component.css'],animations: [fadeInAnimation],
 
    // attach the fade in animation to the host (root) element of this component
    host: { '[@fadeInAnimation]': '' }
})

export class NuevoGrupoComponent {
    @ViewChild('fileInput') fileInput;
    filesToUpload: Array<File> = [];
    maxId:Array<any>;
    grupo: Grupo = {
        id:0,
        nombre:'',
        imagen:'',
        informacion:'',
    };
    id: any;//the file input's id that emits the action (useful if you use the service and handle multiple file inputs, see below)
    currentFiles: any;//list of the current files
    action: any;//see Enum below
    file: any;//the file that caused the action
    // Create an instance of the DataService through dependency injection
    constructor(private _dataService: DataService,
        private route: ActivatedRoute, private http:Http,
        private router: Router, private authService: AuthenticationService) {
            
        if (this.authService.isAuthenticate() == false) {
            this.router.navigateByUrl('/login');
        }
        this._dataService.getMaxId('groups').subscribe(res => {
            this.maxId = res;
            if(this.maxId[0]== null){
                this.maxId[0] ={} ;
                this.maxId[0].id=1;
            }
            else
            this.grupo.id = this.maxId[0].id + 1;
        });
    }

    onSubmit() {
        this.upload();
        const files: Array<File> = this.filesToUpload;
        this.grupo.imagen='assets/uploads/'+files[0].name;        
        //insertar en base de datos
       this._dataService.addGroup(this.grupo);
       this.router.navigateByUrl('/grupos');
    }

    upload() {
        const formData: any = new FormData();
        const files: Array<File> = this.filesToUpload;

        for (let i = 0; i < files.length; i++) {
            formData.append("uploads[]", files[i], files[i]['name']);
        }
        // formData.append("uploads[]", files[0], files[0]['name']);
        //this.address.documents = files.toString();

        this.http.post('http://localhost:3000/api/upload', formData)
            .map(files => files.json())
            .subscribe()
    }

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}
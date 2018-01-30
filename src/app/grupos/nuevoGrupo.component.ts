import { Component, ViewChild, OnInit } from '@angular/core';

import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Http } from '@angular/http';
import { FileUploader } from 'ng2-file-upload';
import { Ng2FileInputService, Ng2FileInputAction } from 'ng2-file-input';
import { Grupo } from './grupo';
import { FancyImageUploaderOptions, UploadedFile } from 'ng2-fancy-image-uploader';
import { AuthenticationService } from '../_services/authentication.service';
import { fadeInAnimation } from '../_animations/index';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { GruposService } from '../_services/grupos.service';

@Component({
    selector: 'nuevoGrupo',
    templateUrl: './nuevoGrupo.component.html',
    styleUrls: ['./grupo.component.css'],
    animations: [fadeInAnimation],
    // attach the fade in animation to the host (root) element of this component
    host: { '[@fadeInAnimation]': '' }
})

export class NuevoGrupoComponent implements OnInit {

    domain = this.authService.domain;
    message: any;
    messageClass: string;
    username: any;
    @ViewChild('fileInput') fileInput;
    filesToUpload: Array<File> = [];
    maxId: Array<any>;
    grupo: any;
    id: any; // the file input's id that emits the action (useful if you use the service and handle multiple file inputs, see below)
    currentFiles: any; // list of the current files
    action: any; // see Enum below
    file: any; // the file that caused the action
    form;
    procesing = false;
    // Create an instance of the DataService through dependency injection
    constructor(private _dataService: DataService,
        private route: ActivatedRoute,
        private grupoService: GruposService,
        private http: Http,
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthenticationService) {
        this.createGrupoForm();
        if (this.authService.loggedIn() === false) {
            this.router.navigateByUrl('/login');
        }
    }

    createGrupoForm() {
        this.form = this.formBuilder.group({
            nombre: ['', Validators.compose([
                Validators.required,
                Validators.maxLength(50),
                Validators.minLength(5)
            ])],
            informacion: ['', Validators.compose([
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(500),
            ])]
        });
    }

    enableForm() {
        this.form.get('informacion').enable();
        this.form.get('nombre').enable();
    }

    disableForm() {
        this.form.get('informacion').disable();
        this.form.get('nombre').disable();
    }

    onSubmit() {
        this.procesing = true;
        this.disableForm();
        this.upload();
        const files: Array<File> = this.filesToUpload;
        let imagePath;
        if (files.length !== 0) {
            imagePath = 'assets/uploads/' + files[0].name;
        }
        const grupo = {
            informacion: this.form.get('informacion').value,
            nombre: this.form.get('nombre').value,
            administrador: this.username,
            imagen: imagePath,
            eventos: [{
                title: 'Titulo 1',
                creditos: 5,
                maxPersonas: 10,
                status: 'open'
            }]
        };
        this.grupoService.newGrupo(grupo).subscribe(data => {
            if (!data.success) {
                this.messageClass = 'alert alert-danger';
                this.message = data.message;
                this.procesing = false;
                this.enableForm();
            } else {
                setTimeout(() => {
                    this.router.navigate(['/grupos']);
                }, 2000);
            }
        });
        // insertar en base de datos
        // this._dataService.addGroup(this.grupo);

        // this.router.navigate(['/grupos']);
        this.enableForm();
    }

    upload() {
        const formData: any = new FormData();
        const files: Array<File> = this.filesToUpload;

        for (let i = 0; i < files.length; i++) {
            formData.append('uploads[]', files[i], files[i]['name']);
        }
        // formData.append("uploads[]", files[0], files[0]['name']);
        // this.address.documents = files.toString();

        this.http.post(this.domain + 'api/upload', formData)
            .map(files => files.json())
            .subscribe();
    }

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    ngOnInit() {
        this.authService.getProfile().subscribe(prof => {
            this.username = prof.user.username;
        });
    }
}

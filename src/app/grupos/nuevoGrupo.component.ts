import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';

import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Http } from '@angular/http';
import { Ng2FileInputService, Ng2FileInputAction } from 'ng2-file-input';
import { Grupo } from './grupo';
import { FancyImageUploaderOptions, UploadedFile } from 'ng2-fancy-image-uploader';
import { AuthenticationService } from '../_services/authentication.service';
import { fadeInAnimation } from '../_animations/fadein.animation';
import { FormBuilder, FormGroupDirective, NgForm, FormGroup, Validators, FormControl } from '@angular/forms';
import { GruposService } from '../_services/grupos.service';

import { ErrorStateMatcher } from '@angular/material/core';
// import the file uploader plugin
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
// define the constant url we would be uploading to.
const URL = 'http://localhost:8080/upload';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

@Component({
    selector: 'app-nuevo-grupo',
    templateUrl: './nuevoGrupo.component.html',
    styleUrls: ['./grupo.component.css'],
    animations: [fadeInAnimation],
    // attach the fade in animation to the host (root) element of this component
    // tslint:disable-next-line:use-host-property-decorator
    host: { '[@fadeInAnimation]': '' }
})

export class NuevoGrupoComponent implements OnInit {
    public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'photo' });
    matcher = new MyErrorStateMatcher();
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
    tags;
    procesing = false;
    // Create an instance of the DataService through dependency injection
    constructor(private _dataService: DataService,
        private route: ActivatedRoute,
        private grupoService: GruposService,
        private http: Http,
        private formBuilder: FormBuilder,
        private el: ElementRef,
        private router: Router,
        private authService: AuthenticationService) {
        this.createGrupoForm();
        if (this.authService.loggedIn() === false) {
            this.router.navigateByUrl('/login');
        }
        this.grupoService.getTags().subscribe(data => {
            if (!data.success) {
                console.log(data.message);
            } else {
                this.tags = data.tags;
            }
        });
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
            ])],
            tags: ''
        });
    }

    enableForm() {
        this.form.get('informacion').enable();
        this.form.get('nombre').enable();
        this.form.get('tags').enable();
    }

    disableForm() {
        this.form.get('informacion').disable();
        this.form.get('nombre').disable();
        this.form.get('tags').disable();
    }

    onSubmit() {
        this.uploader.uploadAll();
        this.procesing = true;
        this.disableForm();
        // this.upload();
        const files: Array<File> = this.filesToUpload;
        let imagePath;
        if (files.length !== 0) {
            imagePath = 'assets/uploads/' + files[0].name;
        }
        const grupo = {
            informacion: this.form.get('informacion').value,
            nombre: this.form.get('nombre').value,
            tags: this.form.get('tags').value,
            administrador: this.username,
            imagen: imagePath,
            username: this.username
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
        // locate the file element meant for the file upload.
        const inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');
        // get the total amount of files attached to the file input.
        const fileCount: number = inputEl.files.length;
        // create a new fromdata instance
        const formData = new FormData();
        // check if the filecount is greater than zero, to be sure a file was selected.
        if (fileCount > 0) { // a file was selected
            // append the key name 'photo' with the first file in the element
            formData.append('photo', inputEl.files.item(0));
            // call the angular http method
            this.http
                // post the form data to the url defined above and map the response.
                // Then subscribe to initiate the post. if you don't subscribe, angular wont post.
                .post(URL, formData).map(res => res.json()).subscribe(
                // map the success function and alert the response
                (success) => {
                    alert(success._body);
                },
                (error) => alert(error));
        }
    }

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
        console.log(this.filesToUpload);
    }

    ngOnInit() {
        this.authService.getProfile().subscribe(prof => {
            this.username = prof.user.username;
        });

        // override the onAfterAddingfile property of the uploader so it doesn't authenticate with //credentials.
        this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
        // overide the onCompleteItem property of the uploader so we are
        // able to deal with the server response.
        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            console.log('ImageUpload:uploaded:', item, status, response);
        };
    }
}

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
import { ENTER, ZERO } from '@angular/cdk/keycodes';

import { ErrorStateMatcher } from '@angular/material/core';
import { UserService } from '../_services/user.service';
import { MatChipInputEvent } from '@angular/material';

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
    styleUrls: ['./grupo.component.css', './reset.css'],
    animations: [fadeInAnimation],
    // attach the fade in animation to the host (root) element of this component
    // tslint:disable-next-line:use-host-property-decorator
    host: { '[@fadeInAnimation]': '' }
})

export class NuevoGrupoComponent implements OnInit {
    separatorKeysCodes = [ENTER, ZERO];
    // matcher = new MyErrorStateMatcher();
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
    isAdmin: boolean;
    formTags = [];
    newTag;
    procesing = false;
    representantes;
    // Create an instance of the DataService through dependency injection
    constructor(private _dataService: DataService,
        private route: ActivatedRoute,
        private grupoService: GruposService,
        private userService: UserService,
        private http: Http,
        private formBuilder: FormBuilder,
        private el: ElementRef,
        private router: Router,
        private authService: AuthenticationService) {
        this.createGrupoForm();
        if (this.authService.loggedIn() === false) {
            this.router.navigateByUrl('/login');
        } else {
            this.grupoService.getTags().subscribe(data => {
                if (!data.success) {
                    console.log(data.message);
                } else {
                    this.tags = data.tags;
                }
            });
            this.isAdmin = localStorage.getItem('role') === 'admin';

            if (this.isAdmin) {
                this.userService.getAllRepresentantes().subscribe(data => {
                    console.log(data);
                    if (data.success) {
                        this.representantes = data.representantes;
                    }
                });
            }
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
            ])],
            representante: localStorage.getItem('usename'),
            tags: '',
            newTag: ''
        });
        this.form.get('newTag').disable();
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

    async onSubmit() {
        this.upload();
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

    async upload() {
        const formData: any = new FormData();
        const files: Array<File> = this.filesToUpload;

        for (let i = 0; i < files.length; i++) {
            formData.append('uploads[]', files[i], files[i]['name']);
        }
        // formData.append("uploads[]", files[0], files[0]['name']);
        // this.address.documents = files.toString();
        this.http.post('/api/upload', formData)
            .map(res => res.json())
            .subscribe();
    }

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
        console.log(this.filesToUpload);
    }

    ngOnInit() {
        this.authService.getProfile().subscribe(prof => {
            if (prof.success) {
                this.username = prof.user.username;
            } else {
                this.authService.logout();
                this.router.navigateByUrl('/login');
            }
        });
    }

    createNewTag() {
        this.form.get('newTag').enable();
        this.newTag = true;
    }

    addToTags() {
        const nuevoTag = this.form.get('newTag').value.trim();

        let arr = this.form.get('tags').value || [];
        console.log(arr.find(obj => obj.toLowerCase() === nuevoTag.toLowerCase()));
        if (nuevoTag !== '' && !arr.find(obj => obj.toLowerCase() === nuevoTag.toLowerCase())) {
            this.tags.push(nuevoTag);
        }

        if (arr) {
            if (nuevoTag !== '' && !arr.find(obj => obj.toLowerCase() === nuevoTag.toLowerCase())) {
                arr.push(nuevoTag);
            }
        } else {
            arr = [];
            if (nuevoTag !== '') {
                arr.push(nuevoTag);
            }
        }
        this.form.controls['tags'].setValue(arr);
        this.newTag = false;
        this.form.patchValue({
            newTag: '',
        });
    }

    toggleTag() {
        this.newTag = false;
    }
}

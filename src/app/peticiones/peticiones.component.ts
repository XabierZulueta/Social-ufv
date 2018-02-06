import { Component, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { User } from '../usuarios/user';
import { fadeInAnimation } from '../_animations/fadein.animation';
@Component({
    selector: 'peticiones',
    templateUrl: './peticiones.component.html', animations: [fadeInAnimation],

    // attach the fade in animation to the host (root) element of this component
    host: { '[@fadeInAnimation]': '' }
})
export class PeticionesComponent {
    isLogged: any;
    idGrupo;
    peticion: any = {
        usuario: User
    };
    peticiones = [];
    usuario: User;
    constructor(private modal: NgbModal, private _dataService: DataService,
        private route: ActivatedRoute, private router: Router,
        private authService: AuthenticationService) {
        this.isLogged = this.authService.loggedIn();
        if (this.isLogged === false) {
            this.router.navigateByUrl('/login');
        }
        const sub = this.route.params.subscribe(params => {
            this.idGrupo = +params['id']; // (+) converts string 'id' to a number
            // In a real app: dispatch action to load the details here.
            this._dataService.getById(params['id'], 'peticiones').subscribe(res => {
                this.peticiones = res;
                for (let i = 0; i < this.peticiones.length; i++) {
                    this.getUsuarios(this.peticiones[i]);
                }

            });
        });


    }

    getUsuarios(peticiones) {
        this._dataService.getById(peticiones.idUsuario, '').subscribe(res => {
            peticiones.idUsuario = res;
        });
    }

    aceptar(peticion) {
        this._dataService.aceptarPeticion(peticion.idUsuario.id, peticion.idGrupo);
        this._dataService.deletePeticion(peticion.id);
        this.peticiones.splice(this.peticiones.indexOf(peticion), 1);
    }

    rechazar(peticion) {
        this._dataService.deletePeticion(peticion.id);
        this.peticiones.splice(this.peticiones.indexOf(peticion), 1);
    }
}
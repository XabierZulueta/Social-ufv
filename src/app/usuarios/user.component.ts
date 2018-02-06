import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { Grupo } from '../grupos/grupo';
import { fadeInAnimation } from '../_animations/fadein.animation';
import { Evento } from '../eventos/evento';
import { JwtHelper } from 'angular2-jwt';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    styleUrls: ['../app.component.css'],
    animations: [fadeInAnimation],
    host: { '[@fadeInAnimation]': '' }
})

export class UserComponent implements OnInit {
    user: any;
    grupos: boolean;
    gruposid: Array<any>;
    id: number;
    isLogged: any;
    ultimoEvento: Array<Evento>;
    organizador;
    tags;
    step = 0;

    setStep(index: number) {
        this.step = index;
    }

    nextStep() {
        this.step++;
    }

    prevStep() {
        this.step--;
    }
    constructor(private _dataService: DataService,
        private route: ActivatedRoute, private authService: AuthenticationService,
        private router: Router) {
        this.ultimoEvento = [];
        this.organizador = { id: 0, nombre: '', imagen: '', informacion: '' };
        this.tags = [];
    }

    ngOnInit() {
        this.isLogged = this.authService.loggedIn();
        if (this.isLogged === false) {
            this.router.navigateByUrl('/login');
        }

        // const sub = this.route.params.subscribe(params => {
        //     this.id = +params['id']; // (+) converts string 'id' to a number
        //     // In a real app: dispatch action to load the details here.
        // });

        this.authService.getProfile().subscribe(profile => {
            this.user = profile.user;
        });

        // this._dataService.getById(this.id, '')
        //     .subscribe(res => {
        //     this.user = res;
        //     this.onSelect(this.user);

        //     this.getHobbies(this.user);
        //     });
        // this._dataService.getUltimoEvento(this.id)
        //     .subscribe(res => {
        //         this.ultimoEvento = res;
        //         this.getOrganizador(this.ultimoEvento[0].organizador.id);
        //     });
        this.grupos = false;
        this.gruposid = new Array<any>();
    }

    getOrganizador(idGrupo) {
        this._dataService.getById(idGrupo, 'groups')
            .subscribe(res => {
                this.organizador = res;

            });
    }

    getHobbies(user) {
        for (let i = 0; i < user.tags.length; i++) {
            this._dataService.getById(user.tags[i], 'tags')
                .subscribe(res => {
                    this.tags.push(res);
                });
        }
    }

    onSelect(user): void {
        const n = user.grupos.length;
        let g = Array<any>();
        if (this.gruposid.length === 0) {
            this.gruposid = user.grupos;
        }
        if (this.grupos === false) {
            g = this.gruposid;
            user.grupos = new Array<Grupo>();
            for (let i = 1; i < n + 1; i++) {
                this._dataService.getById(g[i - 1], 'groups')
                    .subscribe(res => {
                        user.grupos.push(res);
                    });
            }
            this.grupos = true;
        } else {
            this.grupos = false;
        }
    }
}
import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelper, AuthConfig } from 'angular2-jwt';
import { Http } from '@angular/http';
import { Evento } from '../eventos/evento';
import { AuthenticationService } from '../_services/authentication.service';
import { fadeInAnimation } from '../_animations/index';
import { GruposService } from '../_services/grupos.service';
import { UserService } from '../_services/user.service';
import { EventosService } from '../_services/eventos.service';

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
    styleUrls: ['./grupo.component.css'],
    animations: [fadeInAnimation],

    // attach the fade in animation to the host (root) element of this component
    host: { '[@fadeInAnimation]': '' }
})

export class GrupoComponent implements OnInit {
    procesingRequest = false;
    grupo: any;
    id: number;
    evento: any = {
        id: 0,
        start: new Date(),
        end: new Date(),
        title: '',
        color: colors.blue,
        descripcion: '',
        organizador: 11,
        creditos: 1,
        apuntados: '',
        apuntado: false
    };
    eventos: any[];
    miembros: any[];
    nusers: number;
    miembro: boolean;
    apuntado: boolean;
    token: string;
    tokenDecoded: Object;
    userId: string;
    prueba: any;
    jwtHelper: JwtHelper = new JwtHelper();
    isLogged: any;
    npeticiones: any;
    maxIdPeticion: any;
    peticion = { id: 0, idUsuario: 0, idGrupo: 0 };
    esperando: boolean;
    ahora: any;
    isAllow: boolean;

    // Create an instance of the DataService through dependency injection
    constructor(private _dataService: DataService,
        private route: ActivatedRoute,
        private gruposService: GruposService,
        private eventosService: EventosService,
        private router: Router,
        private userService: UserService,
        private http: Http,
        private authService: AuthenticationService) {

    }

    ngOnInit() {
        this.isLogged = this.authService.loggedIn();
        if (this.isLogged === false) {
            this.router.navigateByUrl('/login');
        }

        this.route.params.subscribe(params => {
            this.gruposService.getById(params['id']).subscribe(data => {
                if (!data.success) {
                    alert('err' + data.message);
                } else {
                    console.log(data.grupo);
                    this.grupo = data.grupo;

                    this.eventos = this.grupo.eventos;

                    for (let i = 0; i < this.eventos.length; i++) {
                        this.eventos[i].start = new Date(new Date(this.eventos[i].start).toUTCString());
                        this.eventos[i].end = new Date(new Date(this.eventos[i].end).toUTCString());
                        this.eventos[i].color = colors.blue;
                        console.log(this.eventos[i]);
                        if (this.isMember(this.eventos[i].go)) {
                            this.eventos[i].apuntado = true;
                        } else {
                            this.eventos[i].apuntado = false;
                        }
                    }
                }
            });
            // In a real app: dispatch action to load the details here.
        });

        this.isAllow = localStorage.getItem('role') !== 'alumno';

        // this.token = localStorage.getItem('token');
        // this.tokenDecoded = this.jwtHelper.decodeToken(this.token);
        // this.userId = this.tokenDecoded['id'];
        // this._dataService.getById(this.id, 'groups')
        //     .subscribe(res => this.grupo = res);

        // this.eventos = this.grupo.eventos;

        // for (let i = 0; i < this.eventos.length; i++) {
        //     this.eventos[i].start = new Date(new Date(this.eventos[i].start).toUTCString());
        //     this.eventos[i].end = new Date(new Date(this.eventos[i].end).toUTCString());
        //     this.eventos[i].color = colors.blue;
        //     if (this.isMember(this.eventos[i].apuntados)) {
        //         this.eventos[i].apuntado = true;
        //     } else {
        //         this.eventos[i].apuntado = false;
        //     }
        // }
        this._dataService.getById(this.id, 'users/grupo')
            .subscribe(res => this.miembros = res);

        this._dataService.getNUsers(this.id)
            .subscribe(res => this.nusers = res);
        this._dataService.getNPeticiones(this.id)
            .subscribe(res => this.npeticiones = res);
        this._dataService.esMiembro(this.id, this.userId)
            .subscribe(res => {
                this.miembro = res;
                if (this.miembro != null) {
                    this.miembro = true;
                } else {
                    this.miembro = false;
                }
            });
        this._dataService.esperando(this.id, this.userId)
            .subscribe(res => {
                this.esperando = res;
                if (this.esperando != null) {
                    this.esperando = true;
                } else {
                    this.esperando = false;
                }
            });
        this.ahora = new Date(new Date().toUTCString());

    }

    desapuntarGrupo(idUsuario, idGrupo) {
        this.esperando = false;
        this._dataService.desapuntarGrupo(idUsuario, idGrupo);
        this.ngOnInit();
    }

    apuntarGrupo(idUser, idGrupo) {
        this.peticion.idGrupo = idGrupo;
        this.peticion.idUsuario = idUser;
        this.getMaxId(this.peticion);
    }

    getMaxId(peticion) {
        this._dataService.getMaxId('peticiones').subscribe(res => {
            this.maxIdPeticion = res;
            if (this.maxIdPeticion[0] == null) {
                this.maxIdPeticion[0] = {};
                this.maxIdPeticion[0].id = 1;
                this.peticion.id = 1;
            } else {
                this.peticion.id = this.maxIdPeticion[0].id + 1;
            }
            this._dataService.apuntarGrupo(this.peticion);
        });
    }

    desapuntarEvento(idGrupo, evento) {
        this.procesingRequest = true;
        this.eventosService.desapuntarse(idGrupo, evento).subscribe(data => {
            if (!data.success) {
                alert('Error: ' + data.message);
            } else {
                this.grupo = data.grupo;
                this.initEventos();
            }
        });
    }

    apuntarEvento(idGrupo, evento) {
        this.procesingRequest = true;
        this.eventosService.apuntarse(idGrupo, evento).subscribe(data => {
            if (!data.success) {
                alert('Error: ' + data.message);
            } else {
                this.grupo = data.grupo;
                this.initEventos();
            }
        });
    }

    isMember(array: any[]) {
        const user = localStorage.getItem('user');
        if (array) {
            return (array.findIndex(obj => obj.name === user) !== -1);
        } else {
            return false;
        }
    }

    initEventos() {
        this.eventos = this.grupo.eventos;
        for (let i = 0; i < this.eventos.length; i++) {
            this.eventos[i].start = new Date(new Date(this.eventos[i].start).toUTCString());
            this.eventos[i].end = new Date(new Date(this.eventos[i].end).toUTCString());
            this.eventos[i].color = colors.blue;
            console.log(this.eventos[i]);
            if (this.isMember(this.eventos[i].go)) {
                this.eventos[i].apuntado = true;
            } else {
                this.eventos[i].apuntado = false;
            }
        }
        setTimeout(() => {
            this.procesingRequest = false;
        }, 1500);
    }
}

import { ActivatedRoute } from '@angular/router';
import {
    Component, ChangeDetectionStrategy, ViewChild,
    TemplateRef, OnInit, Renderer2
} from '@angular/core';
import {
    CalendarEvent, CalendarEventAction,
    DAYS_OF_WEEK
} from 'angular-calendar';
import { Subject } from 'rxjs/Subject';
import {
    isSameMonth,
    isSameDay,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    startOfDay,
    endOfDay, setHours, setMinutes,
    format
} from 'date-fns';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../data.service';
import { Evento } from './evento';

import { JwtHelper } from 'angular2-jwt';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { fadeInAnimation } from '../_animations/fadein.animation';
import { UserService } from '../_services/user.service';
import { GruposService } from '../_services/grupos.service';
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
interface Film {
    id: number;
    title: string;
    release_date: string;
}

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'mwl-demo-component',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['../styles.css'],
    templateUrl: 'calendario.template.html', animations: [fadeInAnimation],
    // attach the fade in animation to the host (root) element of this component
    // tslint:disable-next-line:use-host-property-decorator
    host: { '[@fadeInAnimation]': '' }
})

export class CalendarioComponent implements OnInit {
    procesingRequest = false;
    @ViewChild('modalContent') modalContent: TemplateRef<any>;

    isLoading: boolean;
    view = 'month';
    events: any[];
    viewDate: Date = new Date();
    modalData: {
        action: string;
        event: CalendarEvent;
    };
    user;
    organizador: any;
    token: string;
    tokenDecoded: Object;
    userId: string;
    activeDayIsOpen = true;
    jwtHelper: JwtHelper = new JwtHelper();
    isLogged: any;
    locale = 'sp';
    refresh: Subject<any> = new Subject();
    constructor(
        private modal: NgbModal,
        private _dataService: DataService,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private eventosService: EventosService,
        private renderer: Renderer2,
        private authService: AuthenticationService) {
        if (this.authService.loggedIn() === false) {
            this.router.navigateByUrl('/login');
        }
        // this.refresh.next();
        // this.renderer.removeStyle(
        //     document.body,
        //     'background-color'
        // );
        // this.renderer.setStyle(
        //     document.getElementById('contenido'),
        //     'box-shadow',
        //     '0 50px 100px rgba(50, 50, 93, 0.1), 0 15px 35px rgba(50, 50, 93, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1) !important;'
        // );
        // this.renderer.removeStyle(
        //     document.getElementById('contenido'),
        //     'background-color'
        // );
    }

    ngOnInit() {
        this.isLoading = true;
        this.events = [];
        this.eventosService.getAll().subscribe(data => {
            console.log(data);
            if (data.success) {
                this.events = data.eventos;
                this.authService.getProfile().subscribe((profile) => {
                    this.user = profile.user;
                    this.refresh.next();
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500);
                });
            }
            for (let i = 0; i < this.events.length; i++) {
                this.events[i].start = new Date(new Date(this.events[i].start).toUTCString());
                if (!!this.events[i].end) {
                    this.events[i].end = new Date(new Date(this.events[i].end).toUTCString());
                } else {
                }
                this.events[i].color = colors.blue;
                // Si está en la lista de apuntados, ponemos el color del evento en rojo
                // y el boolean apuntado a true, si no, lo pongo a false.
                if (this.isMember(this.events[i].go)) {
                    this.events[i].apuntado = true;
                    this.events[i].color = colors.red;
                } else {
                    this.events[i].apuntado = false;
                }
            }
            this.refresh.next();
            this.procesingRequest = false;
            console.log(this.events);
        });
    }

    handleEvent(action: string, event: Evento): void {
        this.modalData = { event, action };
        this.modal.open(this.modalContent, { size: 'lg' });
    }

    dayClicked({ date, events }: { date: Date; events: Array<Evento>; }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
    }

    desapuntarEvento(idGrupo, evento) {
        this.procesingRequest = true;
        this.eventosService.desapuntarse(idGrupo, evento).subscribe(data => {
            if (!data.success) {
                console.log(data);
                this.procesingRequest = false;
            } else {
                const eventsIndex = this.events.findIndex(obj => obj.grupo._id === idGrupo);
                const eventoActualizado = data.grupo.eventos.find(obj => obj.title === evento);
                eventoActualizado.grupo = {
                    _id: data.grupo._id,
                    nombre: data.grupo.nombre
                };
                this.events[eventsIndex] = eventoActualizado;
            }
            this.ngOnInit();
        });
    }

    apuntarEvento(idGrupo, evento) {
        this.procesingRequest = true;
        this.eventosService.apuntarse(idGrupo, evento).subscribe(data => {
            if (!data.success) {
                console.log(data);
                this.procesingRequest = false;
            } else {
                const eventsIndex = this.events.findIndex(obj => obj.grupo._id === idGrupo);
                const eventoActualizado = data.grupo.eventos.find(obj => obj.title === evento);
                eventoActualizado.grupo = {
                    _id: data.grupo._id,
                    nombre: data.grupo.nombre
                };
                this.events[eventsIndex] = eventoActualizado;
            }
            this.ngOnInit();
        });
    }

    // Método que comprueba si el usuario está apuntado al evento.
    isMember(array: any[]) {
        const user = localStorage.getItem('user');
        if (array) {
            return (array.findIndex(obj => obj.name === user) !== -1);
        } else {
            return false;
        }
    }

    private initEventos() {
        if (this.events) {
            for (let i = 0; i < this.events.length; i++) {
                this.events[i].start = new Date(new Date(this.events[i].start).toUTCString());
                this.events[i].end = new Date(new Date(this.events[i].end).toUTCString());
                this.events[i].color = colors.blue;
                // Si está en la lista de apuntados, ponemos el color del evento en rojo
                // y el boolean apuntado a true, si no, lo pongo a false.
                if (this.isMember(this.events[i].go)) {
                    this.events[i].apuntado = true;
                    this.events[i].color = colors.red;
                } else {
                    this.events[i].apuntado = false;
                }
            }
        }
        this.procesingRequest = false;
        this.refresh.next();
    }
}

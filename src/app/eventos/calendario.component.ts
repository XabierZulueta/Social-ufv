import { ActivatedRoute } from '@angular/router';
import {
    Component, ChangeDetectionStrategy, ViewChild,
    TemplateRef, OnInit  } from '@angular/core';
import {
    CalendarEvent, CalendarEventAction,
    DAYS_OF_WEEK } from 'angular-calendar';
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
    format } from 'date-fns';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../data.service';
import { Evento } from './evento';

import { JwtHelper } from 'angular2-jwt';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { fadeInAnimation } from '../_animations/index';
import { UserService } from '../_services/user.service';

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
    selector: 'mwl-demo-component',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['../styles.css'],
    templateUrl: 'calendario.template.html', animations: [fadeInAnimation],
    // attach the fade in animation to the host (root) element of this component
    host: { '[@fadeInAnimation]': '' }
})

export class CalendarioComponent implements OnInit {
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
    activeDayIsOpen = false;
    jwtHelper: JwtHelper = new JwtHelper();
    isLogged: any;
    locale = 'sp';
    constructor(
        private modal: NgbModal,
        private _dataService: DataService,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private authService: AuthenticationService) {
        if (this.authService.isAuthenticate() === false) {
            this.router.navigateByUrl('/login');
        }
        this.refresh.next();
        document.getElementById('contenido').style.boxShadow = '0 50px 100px rgba(50, 50, 93, 0.1), 0 15px 35px rgba(50, 50, 93, 0.15), \
                                0 5px 15px rgba(0, 0, 0, 0.1) !important;';
    }

    refresh: Subject<any> = new Subject();
    ngOnInit() {
        this.isLoading = true;
        // this._dataService.getGeneral('events').subscribe(res => {
        //     // this.isLoading = false;
        //     this.events = res;
        //     for (let i = 0; i < this.events.length; i++) {
        //         this.events[i].start = new Date(new Date(this.events[i].start).toUTCString());
        //         this.events[i].end = new Date(new Date(this.events[i].end).toUTCString());
        //         this.events[i].color = colors.blue;
        //         // Si está en la lista de apuntados, ponemos el color del evento en rojo
        //         // y el boolean apuntado a true, si no, lo pongo a false.
        //         if (this.isMember(this.events[i].apuntados)) {
        //             this.events[i].apuntado = true;
        //             this.events[i].color = colors.red;
        //         } else {
        //             this.events[i].apuntado = false;
        //         }
        //     }
        //     this.refresh.next();
        // });
        this.events = [];
        // this._dataService.events;
        this.userService.getProfile().subscribe((profile) => {
            this.user = profile.user;
        });

        // this.events = this._dataService.events;
        // this.token = localStorage.getItem('token');
        // this.tokenDecoded = this.jwtHelper.decodeToken(this.token);
        // this.userId = this.tokenDecoded['id'];


        document.getElementById('contenido').style.boxShadow = '0 50px 100px rgba(50, 50, 93, 0.1), \
                            0 15px 35px rgba(50, 50, 93, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1) !important;';
        this.refresh.next();
        this.isLoading = false;
    }

    handleEvent(action: string, event: Evento): void {
        this.modalData = { event, action };
        this.modal.open(this.modalContent, { size: 'lg' });
        this._dataService.getById(event.organizador.id, 'groups')
            .subscribe(res => {
            event.organizador = res;
            });
    }

    dayClicked({date, events}: {date: Date; events: Array<Evento>; } ): void {
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

    desapuntarEvento(idUsuario, idEvento) {
        this._dataService.desapuntarEvento(idUsuario, idEvento);
        this.ngOnInit();
    }

    apuntarEvento(idUsuario, idEvento) {
        this._dataService.apuntarEvento(idUsuario, idEvento);
        this.ngOnInit();
    }

    // Método que comprueba si el usuario está apuntado al evento.
    isMember(array: any[]) {
        return (array.indexOf(this.userId) !== -1);
    }
}

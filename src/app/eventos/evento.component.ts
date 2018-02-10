import { Component, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { DataService } from '../data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
    CalendarEvent,
    CalendarEventAction,
    CalendarEventTimesChangedEvent
} from 'angular-calendar';

import { Evento } from './evento';

import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours
} from 'date-fns';

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
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { Grupo } from '../grupos/grupo';
import { fadeInAnimation } from '../_animations/fadein.animation';
@Component({
    selector: 'app-evento',
    templateUrl: './evento.component.html', animations: [fadeInAnimation],

    // attach the fade in animation to the host (root) element of this component
    // tslint:disable-next-line:use-host-property-decorator
    host: { '[@fadeInAnimation]': '' }
})
export class EventoComponent {
    view = 'month';
    viewDate: Date = new Date();
    organizador: {
        id: 0,
        nombre: '',
        imagen: '',
        informacion: ''
    };
    maxId: Array<any>;
    isLogged: any;
    event: Evento =
        {
            id: 0,
            start: subDays(startOfDay(new Date()), 1),
            end: addDays(new Date(), 1),
            title: '',
            color: '',
            descripcion: '',
            organizador: { id: 1 },
            creditos: 0,
            apuntados: []
        }
        ;

    constructor(private modal: NgbModal, private _dataService: DataService,
        private route: ActivatedRoute, private router: Router,
        private authService: AuthenticationService) {
        this.isLogged = this.authService.loggedIn();
        if (this.isLogged === false) {
            this.router.navigateByUrl('/login');
        }
        this._dataService.getMaxId('events').subscribe(res => {
            this.maxId = res;
            this.event.id = this.maxId[0].id + 1;
        });

        const sub = this.route.params.subscribe(params => {
            this.event.organizador.id = +params['id']; // (+) converts string 'id' to a number
            // In a real app: dispatch action to load the details here.
            this._dataService.getById(params['id'], 'groups').subscribe(res => {
                this.organizador = res;

            });
        });


    }


    onSubmit() {
        this.addEvento(this.event);
        this.router.navigateByUrl('/calendario');
    }

    addEvento(event: Evento) {
        this._dataService.addEvent(event);
    }

}

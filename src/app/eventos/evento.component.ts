import { Component, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
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
@Component({
    selector: 'evento',
    templateUrl: './evento.component.html'
})
export class EventoComponent {
    view: string = 'month';

    viewDate: Date = new Date();

    maxId : Array<any>;

    event: Evento =
    {
        id:0,
        start: subDays(startOfDay(new Date()), 1),
        end: addDays(new Date(), 1),
        title: '',
        color: '',
        descripcion: '',
        organizador: {id:1},
        creditos: 0,
    }
    ;

    constructor(private modal: NgbModal, private _dataService: DataService,
        private route: ActivatedRoute, private router: Router) {

            this._dataService.getMaxId('events').subscribe(res => {
                this.maxId = res;
                this.event.id = this.maxId[0].id+1;
            });
    }
   

    onSubmit(){
        this.addEvento(this.event);
        this.router.navigateByUrl('/calendario');
    }

    addEvento(event:Evento){
        this._dataService.addEvent(event);
    }

}
import {
    Component, ChangeDetectionStrategy, ViewChild,
    TemplateRef } from '@angular/core';
import {
    CalendarEvent, CalendarEventAction,
    DAYS_OF_WEEK } from 'angular-calendar';
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
import { DataService } from './data.service';

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
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['styles.css'],
    templateUrl: 'calendario.template.html'
})

export class CalendarioComponent {
    @ViewChild('modalContent') modalContent: TemplateRef<any>;

    view: string = 'month';
    events: any[] = [{
        title: 'Escalada',
        start: new Date(),
        color: colors.blue,
        creditos: 0.0,
        organizador: "Musgoletus",
        end: setHours(new Date(), 18),
        descripcion: 'Miriam no ha invitado a Manza a la montaña.'
    }];
    viewDate: Date = new Date();
    modalData: {
        action: string;
        event: CalendarEvent;
    };

    activeDayIsOpen: boolean = false;

    locale:string='sp';
    constructor(private modal: NgbModal, private _dataService: DataService) { 
        console.log(this.events);
        for(var i=0;i<this.events.length;i++)
            console.log(this.events[i].start);
        this._dataService.getEventos()
            .subscribe(res => { this.events = res; console.log(this.events); });
    }

    

    handleEvent(action: string, event: CalendarEvent): void {
        this.modalData = { event, action };
        this.modal.open(this.modalContent, { size: 'lg' });
    }

    dayClicked({
    date,
        events
  }: {
            date: Date;
            events: Array<CalendarEvent<{ film: Film }>>;
        }): void {
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

}
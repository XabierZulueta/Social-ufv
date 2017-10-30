import {
    CalendarEvent,
    CalendarEventAction,
    CalendarEventTimesChangedEvent
} from 'angular-calendar';

export class Evento implements CalendarEvent{
    id:number;
    start: Date;
    end?: Date;
    title: string;
    color: any;
    descripcion: string;
    organizador: any;
    creditos:number;
    apuntados?:any[];
}
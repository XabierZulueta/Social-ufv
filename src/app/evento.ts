import {
    CalendarEvent,
    CalendarEventAction,
    CalendarEventTimesChangedEvent
} from 'angular-calendar';

export class Evento implements CalendarEvent{
    start: Date;
    end?: Date;
    title: string;
    color: any;
    descripcion: string;
    organizador: number;
    creditos:number;

}
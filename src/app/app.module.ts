import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { GrupoComponent } from './grupos/grupo.component';
import { GruposComponent } from './grupos/grupos.component';
import { UsersComponent } from './usuarios/users.component';
import { UserComponent } from './usuarios/user.component';
import { DataService } from './data.service';
import { CalendarioComponent } from './eventos/calendario.component';
import { EventoComponent } from './eventos/evento.component';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';

import { DemoUtilsModule } from './demo-utils/module';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'angular-calendar';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DayPilotModule } from "daypilot-pro-angular";
//import { DatePickerModule } from 'ng2-datepicker-bootstrap';

import { AppRoutingModule } from './app-routing.module';



@NgModule({
  declarations: [
    AppComponent,
    GruposComponent,
    GrupoComponent,
    UserComponent,
    UsersComponent,
    CalendarioComponent,
    EventoComponent
  //  UsuariosComponent
  ],
  imports: [
    BrowserModule,
    DayPilotModule,
    CommonModule,
   FormsModule, 
    BrowserAnimationsModule,
    NgbModalModule.forRoot(),
    CalendarModule.forRoot(),
    HttpModule,
    NgbModule,
    AppRoutingModule,
    DemoUtilsModule,   
   // DatePickerModule,
   // InMemoryWebApiModule.forRoot(InMemoryDataService),
  ],
  providers: [//UsuariosService,
     DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }

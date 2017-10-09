import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { GrupoComponent } from './grupo.component';
import { GruposComponent } from './grupos.component';
import { UsersComponent } from './users.component';
import { UserComponent } from './user.component';
import { DataService } from './data.service';
import { CalendarioComponent } from './calendario.component';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';

import { DemoUtilsModule } from './demo-utils/module';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'angular-calendar';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DayPilotModule } from "daypilot-pro-angular";

import { AppRoutingModule } from './app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    GruposComponent,
    GrupoComponent,
    UserComponent,
    UsersComponent,
    CalendarioComponent,
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
    DemoUtilsModule
   // InMemoryWebApiModule.forRoot(InMemoryDataService),
  ],
  providers: [//UsuariosService,
     DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }

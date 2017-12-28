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
import { NuevoGrupoComponent } from './grupos/nuevoGrupo.component';
import { LoginComponent } from './login/login.component'
import { RegisterComponent } from './register/register.component'


import { InMemoryWebApiModule } from 'angular-in-memory-web-api';

import { DemoUtilsModule } from './demo-utils/module';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'angular-calendar';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DayPilotModule } from "daypilot-pro-angular";
//import { DatePickerModule } from 'ng2-datepicker-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Ng2FileInputModule } from 'ng2-file-input';
import { AppRoutingModule } from './app-routing.module';
import { ImageUploadModule } from "angular2-image-upload";
import { FancyImageUploaderModule } from 'ng2-fancy-image-uploader';


import { AuthenticationService } from './_services/authentication.service';
import { AlertService } from './_services/alert.service';
import { UserService } from './_services/user.service';
import { AuthGuard } from './_guards/auth.guard'
import { PeticionesComponent } from './peticiones/peticiones.component';
import { PagerService } from './_services/index';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [
    AppComponent,
    GruposComponent,
    GrupoComponent,
    UserComponent,
    UsersComponent,
    CalendarioComponent,
    EventoComponent,
    NuevoGrupoComponent,
    LoginComponent,
    RegisterComponent,
    PeticionesComponent,
   
  ],
  imports: [
    BrowserModule,
    DayPilotModule,
    CommonModule,
   FormsModule, 
    BrowserAnimationsModule,
    NgbModalModule.forRoot(),
    CalendarModule.forRoot(),
    ImageUploadModule.forRoot(),
    HttpModule,
    NgbModule,
    AppRoutingModule,
    DemoUtilsModule,   
    Ng2FileInputModule,
    FancyImageUploaderModule,
    MatCheckboxModule
   // DatePickerModule,
   // InMemoryWebApiModule.forRoot(InMemoryDataService),
  ],
  providers: [//UsuariosService,
    DataService,
    AuthenticationService,
    AlertService,
    UserService,
    AuthGuard,
    PagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

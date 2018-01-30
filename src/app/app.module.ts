import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { GrupoComponent } from './grupos/grupo.component';
import { GruposComponent } from './grupos/grupos.component';
import { UsersComponent } from './usuarios/users.component';
import { UserComponent } from './usuarios/user.component';
import { DataService } from './data.service';
import { CalendarioComponent } from './eventos/calendario.component';
import { EventoComponent } from './eventos/evento.component';
import { NuevoGrupoComponent } from './grupos/nuevoGrupo.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';

import { DemoUtilsModule } from './demo-utils/module';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'angular-calendar';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DayPilotModule } from 'daypilot-pro-angular';
// import { DatePickerModule } from 'ng2-datepicker-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Ng2FileInputModule } from 'ng2-file-input';
import { AppRoutingModule } from './app-routing.module';
import { ImageUploadModule } from 'angular2-image-upload';
import { FancyImageUploaderModule } from 'ng2-fancy-image-uploader';


import { AuthenticationService } from './_services/authentication.service';
import { AlertService } from './_services/alert.service';
import { UserService } from './_services/user.service';
import { EventosService } from './_services/eventos.service';
import { NotificacionesService } from './_services/notificaciones.service';
import { AuthGuard } from './_guards/auth.guard';
import { NotAuthGuard } from './_guards/notAuth.guard';
import { PeticionesComponent } from './peticiones/peticiones.component';
import { PagerService } from './_services/index';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { ConfirmacionAsistenciasComponent } from './_components/confirmacion-asistencias/confirmacion-asistencias.component';
import { GruposService } from './_services/grupos.service';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from './_components/nav-bar/nav-bar.component';
import { FlashMessagesModule } from 'angular2-flash-messages';


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
    ConfirmacionAsistenciasComponent,
    NavBarComponent,
  ],
  imports: [
    BrowserModule,
    DayPilotModule,
    CommonModule,
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
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    ReactiveFormsModule,
    FormsModule,
    FlashMessagesModule.forRoot()
    // DatePickerModule,
    // InMemoryWebApiModule.forRoot(InMemoryDataService),
  ],
  providers: [// UsuariosService,
    DataService,
    AuthenticationService,
    NotificacionesService,
    AlertService,
    UserService,
    GruposService,
    EventosService,
    AuthGuard,
    NotAuthGuard,
    PagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

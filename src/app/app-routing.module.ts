import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GruposComponent } from './grupos/grupos.component';
import { GrupoComponent } from './grupos/grupo.component';
import { UsersComponent } from './usuarios/users.component';
import { UserComponent } from './usuarios/user.component';
import { CalendarioComponent } from './eventos/calendario.component';
import { EventoComponent } from './eventos/evento.component';
import { NuevoGrupoComponent } from './grupos/nuevoGrupo.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PeticionesComponent } from './peticiones/peticiones.component';
import { ConfirmacionAsistenciasComponent } from './_components/confirmacion-asistencias/confirmacion-asistencias.component';
import { AuthGuard } from './_guards/auth.guard';
import { NotAuthGuard } from './_guards/notAuth.guard';
import { CuentaActivadaComponent } from './_components/cuenta-activada/cuenta-activada.component';
import { SendActivationLinkComponent } from './_components/send-activation-link/send-activation-link.component';
import { ResetPasswordComponent } from './_components/reset/reset-password/reset-password.component';
import { ResetUsernameComponent } from './_components/reset/reset-username/reset-username.component';

const routes: Routes = [
    { path: '', redirectTo: '', pathMatch: 'full', component: CalendarioComponent },
    { path: 'grupos', component: GruposComponent, canActivate: [AuthGuard] },
    { path: 'usuarios', component: UsersComponent, canActivate: [AuthGuard] },
    { path: 'grupo/:id', component: GrupoComponent, canActivate: [AuthGuard] },
    { path: 'user/:id', component: UserComponent, canActivate: [AuthGuard] },
    { path: 'calendario', component: CalendarioComponent, canActivate: [AuthGuard] },
    { path: 'nuevoEvento/:id', component: EventoComponent, canActivate: [AuthGuard] },
    { path: 'nuevo/grupo', component: NuevoGrupoComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent, canActivate: [NotAuthGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [NotAuthGuard] },
    { path: 'notificaciones', component: ConfirmacionAsistenciasComponent, canActivate: [AuthGuard] },
    { path: 'activate/:token', component: CuentaActivadaComponent },
    { path: 'resend', component: SendActivationLinkComponent },
    { path: 'resetPassword', component: ResetPasswordComponent, canActivate: [NotAuthGuard] },
    { path: 'resetUsername', component: ResetUsernameComponent, canActivate: [NotAuthGuard] }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

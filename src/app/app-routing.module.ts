import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GruposComponent } from './grupos/grupos.component';
import { GrupoComponent } from './grupos/grupo.component';
import { UsersComponent } from './usuarios/users.component';
import { UserComponent } from './usuarios/user.component';
import { CalendarioComponent } from './eventos/calendario.component';
import { EventoComponent } from './eventos/evento.component';
import { NuevoGrupoComponent } from './grupos/nuevoGrupo.component';
import { LoginComponent } from './login/login.component'
import { RegisterComponent } from './register/register.component'

const routes: Routes = [
    { path: '', redirectTo: '', pathMatch: 'full', component: CalendarioComponent },
    { path: 'grupos', component: GruposComponent },
    { path: 'usuarios', component: UsersComponent },
    { path: 'grupo/:id', component: GrupoComponent },
    { path: 'user/:id', component: UserComponent },
    { path: 'calendario', component: CalendarioComponent},
    { path: 'nuevoEvento/:id', component: EventoComponent },
    { path: 'nuevo/grupo', component: NuevoGrupoComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent }

];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

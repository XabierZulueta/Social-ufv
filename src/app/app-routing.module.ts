import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GruposComponent } from './grupos.component';
import { GrupoComponent } from './grupo.component';
import { UsersComponent } from './users.component';
import { UserComponent } from './user.component';
import { CalendarioComponent } from './calendario.component';

const routes: Routes = [
    { path: '', redirectTo: '', pathMatch: 'full' },
    { path: 'grupos', component: GruposComponent },
    { path: 'usuarios', component: UsersComponent },
    { path: 'grupo/:id', component: GrupoComponent },
    { path: 'user/:id', component: UserComponent },
    { path: 'calendario', component: CalendarioComponent}

];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

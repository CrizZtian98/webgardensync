import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { PublicacionesComponent } from './pages/publicaciones/publicaciones.component';
import { UsuariosregistradosComponent } from './pages/usuariosregistrados/usuariosregistrados.component';
import { RegistrohogarComponent } from './pages/registrohogar/registrohogar.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'registro', component: RegistroComponent},
    {path: 'perfil', component: PerfilComponent},
    {path: 'publicaciones', component: PublicacionesComponent},
    {path: 'usuariosregistrados', component: UsuariosregistradosComponent},
    {path: 'registrohogar', component: RegistrohogarComponent}
];

import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { PublicacionesComponent } from './pages/publicaciones/publicaciones.component';
import { UsuariosregistradosComponent } from './pages/usuariosregistrados/usuariosregistrados.component';
import { RegistrohogarComponent } from './pages/registrohogar/registrohogar.component';
import { ModalpublicacionComponent } from './components/modalpublicacion/modalpublicacion.component';
import { Prueba1Component } from './pages/prueba1/prueba1.component';
import { Prueba2Component } from './components/prueba2/prueba2.component';
import { ComentariosComponent } from './pages/comentarios/comentarios.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'registro', component: RegistroComponent},
    {path: 'perfil', component: PerfilComponent},
    {path: 'publicaciones', component: PublicacionesComponent},
    {path: 'usuariosregistrados', component: UsuariosregistradosComponent},
    {path: 'registrohogar', component: RegistrohogarComponent},
    {path: 'modalpublicacion', component: ModalpublicacionComponent},
    {path: 'prueba1', component: Prueba1Component},
    {path: 'prueba2', component: Prueba2Component},
    {path: 'comentarios', component: ComentariosComponent}

];

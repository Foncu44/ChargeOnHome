import { Routes } from '@angular/router';
import { MapaGarajesComponent } from './components/mapa-garajes/mapa-garajes.component';
import { PerfilUsuarioComponent } from './components/perfil-usuario/perfil-usuario.component';
import { DetalleGarajeComponent } from './components/detalle-garaje/detalle-garaje.component';
import { RegistrarGarajeComponent } from './components/registrar-garaje/registrar-garaje.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegistroComponent } from './components/auth/registro/registro.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/mapa', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'mapa', component: MapaGarajesComponent },
  { path: 'garaje/:id', component: DetalleGarajeComponent },
  { path: 'perfil', component: PerfilUsuarioComponent, canActivate: [authGuard] },
  { path: 'registrar-garaje', component: RegistrarGarajeComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/mapa' }
];

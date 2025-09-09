import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'estudiante',
    loadComponent: () => import('./estudiante/estudiante.page').then( m => m.EstudiantePage)
  },
  {
    path: 'profesor',
    loadComponent: () => import('./profesor/profesor.page').then( m => m.ProfesorPage)
  },
  {
    path: 'estudiante-sso',
    loadComponent: () => import('./estudiante-sso/estudiante-sso.page').then( m => m.EstudianteSSOPage)
  },
];

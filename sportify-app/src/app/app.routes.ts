import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'competitions',
    loadComponent: () => import('./components/competitions/competitions.component').then(m => m.CompetitionsComponent)
  },
  {
    path: 'competitions/:id',
    loadComponent: () => import('./components/competition-detail/competition-detail.component').then(m => m.CompetitionDetailComponent)
  },
  {
    path: 'teams/:id',
    loadComponent: () => import('./components/team-detail/team-detail.component').then(m => m.TeamDetailComponent)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

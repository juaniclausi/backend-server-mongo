import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { AccoutSettingsComponent } from './accout-settings/accout-settings.component';
import { LoginGuardGuard } from '../services/guards/login-guard.guard';

const pagesRutes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate:[ LoginGuardGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'progress', component: ProgressComponent },
      { path: 'graficas1', component: Graficas1Component },
      { path: 'accout-settings', component: AccoutSettingsComponent },
      { path: '', pathMatch: 'full', redirectTo: '/dashboard' }
    ]
  },
];


@NgModule({
  imports: [RouterModule.forChild(pagesRutes)],
  exports: [RouterModule]
})
export class PagesRoutesModule { }

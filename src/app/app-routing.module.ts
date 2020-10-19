import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import * as LoginModule from './modules/login/login.module';
import { SessionService } from './modules/login/services/session/session.service';
import { WorkbenchComponent } from './modules/vendor-management/workbench/workbench.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { VendorRegistrationComponent } from './modules/vendor-management/vendor-registration/vendor-registration.component';

const routes: Routes = [
  {
    path: 'registration',
    component: VendorRegistrationComponent,
  },
  {
    path: 'registration/:template_code',
    component: VendorRegistrationComponent,
  },
  {
    path: 'workbench',
    component: WorkbenchComponent,
    canActivate: [
      SessionService
    ]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [
      SessionService
    ]
  },
  {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

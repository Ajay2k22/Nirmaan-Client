import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register.module').then(
        (m) => m.RegisterPageModule,
      ),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'forget-password',
    loadChildren: () =>
      import('./pages/forget-password/forget-password.module').then(
        (m) => m.ForgetPasswordPageModule,
      ),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import('./pages/reset-password/reset-password.module').then(
        (m) => m.ResetPasswordPageModule,
      ),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./pages/dashboard/dashboard.module').then(
        (m) => m.DashboardPageModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'createComplaint',
    loadChildren: () =>
      import('./pages/create-complaint/create-complaint.module').then(
        (m) => m.CreateComplaintPageModule,
      ),
    canActivate: [AuthGuard],
  },
  // {
  //   path: 'view-all-complaint',
  //   loadChildren: () =>
  //     import('./pages/view-all-complaint/view-all-complaint.module').then(
  //       (m) => m.ViewAllComplaintPageModule,
  //     ),
  //   canActivate: [AuthGuard],
  // },
  {
    path: 'viewComplaint',
    loadChildren: () =>
      import('./pages/view-complaint/view-complaint.module').then(
        (m) => m.ViewComplaintPageModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'tickets',
    loadChildren: () =>
      import('./pages/tickets/tickets.module').then((m) => m.TicketsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'location-picker',
    loadChildren: () =>
      import('./pages/location-picker/location-picker.module').then(
        (m) => m.LocationPickerPageModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

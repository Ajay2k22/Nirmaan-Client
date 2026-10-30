import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../pages/dashboard/dashboard.module').then(
            (m) => m.DashboardPageModule,
          ),
      },
      {
        path: 'tickets',
        loadChildren: () =>
          import('../pages/tickets/tickets.module').then(
            (m) => m.TicketsPageModule,
          ),
      },
      {
        path: 'create-complaint',
        loadChildren: () =>
          import('../pages/create-complaint/create-complaint.module').then(
            (m) => m.CreateComplaintPageModule,
          ),
      },
      {
        path: 'view-complaint/:id',
        loadChildren: () =>
          import('../pages/view-complaint/view-complaint.module').then(
            (m) => m.ViewComplaintPageModule,
          ),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  // REMOVE the extra redirect below - you had 2 redirects, keep only inside children
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}

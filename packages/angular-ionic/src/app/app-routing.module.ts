import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((c) => c.HomePage),
    children: [
      { path: '', redirectTo: 'summary', pathMatch: 'full' },
      {
        path: 'budget',
        loadComponent: () =>
          import('./pages/home/budget/budget.page').then((c) => c.BudgetPage),
      },
      {
        path: 'report',
        loadComponent: () =>
          import('./pages/home/report/report.page').then((c) => c.ReportPage),
      },
      {
        path: 'summary',
        loadComponent: () =>
          import('./pages/home/summary/summary.page').then(
            (c) => c.SummaryPage
          ),
      },
      {
        path: 'trans',
        loadComponent: () =>
          import('./pages/home/trans/trans.page').then((c) => c.TransPage),
      },
    ],
  },
  {
    path: 'change-password',
    loadComponent: () =>
      import('./pages/change-password/change-password.page').then(
        (c) => c.ChangePasswordPage
      ),
  },
  {
    path: 'my-account',
    loadComponent: () =>
      import('./pages/my-account/my-account.page').then((c) => c.MyAccountPage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((c) => c.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then((c) => c.RegisterPage),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./pages/search/search.page').then((c) => c.SearchPage),
  },
  {
    path: 'trans-edit',
    loadComponent: () =>
      import('./pages/trans-edit/trans-edit.page').then((c) => c.TransEditPage),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

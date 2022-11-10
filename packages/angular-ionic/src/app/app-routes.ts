import { Route, Routes } from '@angular/router';
import {
  canActivate,
  redirectUnauthorizedTo,
} from '@angular/fire/compat/auth-guard';

const redirectTLogin = () => redirectUnauthorizedTo(['auth/login']);

const authRoute: Route = {
  path: 'auth',
  children: [
    {
      path: 'login',
      loadComponent: () =>
        import('./pages/auth/login/login.page').then((c) => c.LoginPage),
    },
    {
      path: 'register',
      loadComponent: () =>
        import('./pages/auth/register/register.page').then((c) => c.RegisterPage),
    },
  ],
};

const homeRoute: Route = {
  path: 'home',
  loadComponent: () => import('./pages/home/home.page').then((c) => c.HomePage),
  ...canActivate(redirectTLogin),
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
        import('./pages/home/summary/summary.page').then((c) => c.SummaryPage),
    },
    {
      path: 'trans',
      loadComponent: () =>
        import('./pages/home/trans/trans.page').then((c) => c.TransPage),
    },
  ],
};

const userRoute: Route = {
  path: 'user',
  ...canActivate(redirectTLogin),
  children: [
    { path: '', redirectTo: 'my-account', pathMatch: 'full' },
    {
      path: 'change-password',
      loadComponent: () =>
        import('./pages/user/change-password/change-password.page').then(
          (c) => c.ChangePasswordPage
        ),
    },
    {
      path: 'my-account',
      loadComponent: () =>
        import('./pages/user/my-account/my-account.page').then(
          (c) => c.MyAccountPage
        ),
    },
  ],
};

const transactionRoute: Route = {
  path: 'trans',
  ...canActivate(redirectTLogin),
  children: [
    { path: '', redirectTo: 'search', pathMatch: 'full' },
    {
      path: 'search',
      loadComponent: () =>
        import('./pages/trans/search/search.page').then((c) => c.SearchPage),
    },
    {
      path: 'edit/:id',
      loadComponent: () =>
        import('./pages/trans/edit/edit.page').then(
          (c) => c.TransEditPage
        ),
    },
    {
      path: 'edit',
      loadComponent: () =>
        import('./pages/trans/edit/edit.page').then(
          (c) => c.TransEditPage
        ),
    },
  ],
};

export const AppRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  authRoute,
  homeRoute,
  userRoute,
  transactionRoute,
];

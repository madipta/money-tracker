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
      path: 'reset-password',
      loadComponent: () =>
        import('@monic/libs/auth').then((c) => c.ResetPasswordComponent),
    },
    {
      path: 'login',
      loadComponent: () =>
        import('@monic/libs/auth').then((c) => c.LoginFormComponent),
    },
    {
      path: 'register',
      loadComponent: () =>
        import('@monic/libs/auth').then((c) => c.RegisterFormComponent),
    },
  ],
};

const homeRoute: Route = {
  path: 'home',
  loadComponent: () => import('./home/home.page').then((c) => c.HomePage),
  ...canActivate(redirectTLogin),
  children: [
    { path: '', redirectTo: 'summary', pathMatch: 'full' },
    {
      path: 'budget',
      loadComponent: () =>
        import('./home/budget/budget.page').then((c) => c.BudgetPage),
    },
    {
      path: 'report',
      loadComponent: () =>
        import('./home/report/report.page').then((c) => c.ReportPage),
    },
    {
      path: 'summary',
      loadComponent: () =>
        import('@monic/libs/transaction').then((c) => c.SummaryComponent),
    },
    {
      path: 'trans',
      loadComponent: () =>
        import('@monic/libs/transaction').then(
          (c) => c.TransactionListComponent
        ),
    },
  ],
};

const userRoute: Route = {
  path: 'user',
  ...canActivate(redirectTLogin),
  children: [
    { path: '', redirectTo: 'my-account', pathMatch: 'full' },
    {
      path: 'my-account',
      loadComponent: () =>
        import('@monic/libs/user').then((c) => c.AccountFormComponent),
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
        import('@monic/libs/transaction').then((c) => c.SearchComponent),
    },
    {
      path: 'edit/:id',
      loadComponent: () =>
        import('@monic/libs/transaction').then(
          (c) => c.TransactionFormComponent
        ),
    },
    {
      path: 'edit',
      loadComponent: () =>
        import('@monic/libs/transaction').then(
          (c) => c.TransactionFormComponent
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

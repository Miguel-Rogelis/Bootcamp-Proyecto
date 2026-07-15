import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'recuperar-password', component: ForgotPasswordComponent },
    { path: 'restablecer-password', component: ResetPasswordComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [adminGuard] },
    { path: '**', redirectTo: '' }
];

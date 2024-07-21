import { LoginComponent } from './pages/public/login/login.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/secure/home/home.component';

export const routes: Routes = [
    { path: '', redirectTo: "login", pathMatch: "full" },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: LoginComponent },
    { path: 'home', component: HomeComponent }
];

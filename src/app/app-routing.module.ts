import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './public/register/register.component';
import { LoginComponent } from './public/login/login.component';
import { HomeComponent } from './public/home/home.component';
import { CompleteProfileComponent } from './public/complete-profile/complete-profile.component';
import { profileGuard } from './core/guards/auth/profile.guard';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [profileGuard],
  },

  { path: 'complete-profile', component: CompleteProfileComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

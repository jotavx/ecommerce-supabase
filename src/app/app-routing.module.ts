import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './public/register/register.component';
import { LoginComponent } from './public/login/login.component';
import { HomeComponent } from './public/home/home.component';
import { CompleteProfileComponent } from './public/complete-profile/complete-profile.component';
import { profileGuard } from './core/guards/auth/profile.guard';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { CartComponent } from './public/cart/cart.component';
import { OrdersManagerComponent } from './admin/orders-manager/orders-manager.component';
import { OrdersDetailComponent } from './admin/orders-detail/orders-detail.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [profileGuard],
  },

  { path: 'dashboard', component: DashboardComponent },

  { path: 'cart', component: CartComponent },
  { path: 'orders', component: OrdersManagerComponent },
  { path: 'orders/:id', component: OrdersDetailComponent },

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

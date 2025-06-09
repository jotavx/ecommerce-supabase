import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './public/register/register.component';
import { LoginComponent } from './public/login/login.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { MatInputModule } from '@angular/material/input';

import { HomeComponent } from './public/home/home.component';
import { CompleteProfileComponent } from './public/complete-profile/complete-profile.component';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { MainContainerComponent } from './shared/layout/main-container/main-container.component';
import { ProfileUserComponent } from './public/profile-user/profile-user.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ProductManagerComponent } from './admin/product-manager/product-manager.component';
import { CategoryManagerComponent } from './admin/category-manager/category-manager.component';
import { ProductDialogComponent } from './shared/components/product-dialog/product-dialog.component';
import { CategoryDialogComponent } from './shared/components/category-dialog/category-dialog.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { CartComponent } from './public/cart/cart.component';
import { ProductListComponent } from './public/product-list/product-list.component';
import { OrdersManagerComponent } from './admin/orders-manager/orders-manager.component';
import { OrdersDetailComponent } from './admin/orders-detail/orders-detail.component';
import { TrackOrderComponent } from './public/track-order/track-order.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    CompleteProfileComponent,
    SpinnerComponent,
    MainContainerComponent,
    ProfileUserComponent,
    DashboardComponent,
    ProductManagerComponent,
    CategoryManagerComponent,
    ProductDialogComponent,
    CategoryDialogComponent,
    ConfirmDialogComponent,
    NavbarComponent,
    CartComponent,
    ProductListComponent,
    OrdersManagerComponent,
    OrdersDetailComponent,
    TrackOrderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}

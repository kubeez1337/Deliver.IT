import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutPageComponent } from './about-page/about-page.component';
import { OrdersPageComponent } from './orders-page/orders-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { InfoPageComponent } from './info-page/info-page.component';
import { NewOrderComponent } from './new-order/new-order.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { FoodManagerComponent } from './food-manager/food-manager.component';
import { AdminGuard } from './guards/admin.guard';
import { LoggedGuard } from './guards/logged.guard';
import { AccountComponent } from './account/account.component';
import { NotLoggedInComponent } from './not-logged-in/not-logged-in.component';


const routes: Routes = [
  { path: '', component: InfoPageComponent},
  { path: 'about-page', component: AboutPageComponent },
  { path: 'info-page', component: InfoPageComponent },
  { path: 'user-login-page', component: LoginPageComponent },
  { path: 'list-orders-page', component: OrdersPageComponent, canActivate: [LoggedGuard] },
  { path: 'new-order', component: NewOrderComponent, canActivate: [LoggedGuard] },
  { path: 'registration-page', component: RegistrationPageComponent },
  { path: 'account-panel', component: AccountComponent, canActivate: [LoggedGuard] },
  { path: 'food-manager', component: FoodManagerComponent, canActivate: [AdminGuard]},
  { path: 'not-logged-in', component: NotLoggedInComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }

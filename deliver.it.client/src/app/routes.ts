import {Routes} from '@angular/router';
import { AboutPageComponent } from './about-page/about-page.component';
import { InfoPageComponent } from './info-page/info-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { OrdersPageComponent } from './orders-page/orders-page.component';
const routeConfig: Routes = [
  {
    path: 'about-page',
    component: AboutPageComponent,
    title: 'About',
  },
  {
    path: 'info-page',
    component: InfoPageComponent,
    title: 'Info',
  },
  {
    path: 'login-page',
    component: LoginPageComponent,
    title: 'Login',
  },
  {
    path: 'orders-page',
    component: OrdersPageComponent,
    title: 'Orders',
  },

];
export default routeConfig;

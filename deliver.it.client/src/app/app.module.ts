import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InfoPageComponent } from './info-page/info-page.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { OrdersPageComponent } from './orders-page/orders-page.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NavbarComponent } from './navbar/navbar.component';
import { MatButtonModule } from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar'
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card'
import { MatMenuModule } from '@angular/material/menu';
import { NewOrderComponent } from './new-order/new-order.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EditOrderDialogComponent } from './edit-order-dialog/edit-order-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthInterceptor } from './auth.interceptor';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { FoodManagerComponent } from './food-manager/food-manager.component';
import { AccountComponent } from './account/account.component';
import { CourierApplicationsComponent } from './courier-applications/courier-applications.component';
import { ViewOrderDialogComponent } from './view-order-dialog/view-order-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    InfoPageComponent,
    AboutPageComponent,
    LoginPageComponent,
    OrdersPageComponent,
    NavbarComponent,
    RegistrationPageComponent,
    NewOrderComponent,
    EditOrderDialogComponent,
    RegistrationPageComponent,
    FoodManagerComponent,
    AccountComponent,
    CourierApplicationsComponent,
    ViewOrderDialogComponent,
    
  ],
  imports: [
    MatCardModule,
    BrowserModule, HttpClientModule, FormsModule, MatMenuModule, MatTableModule,MatPaginatorModule, MatCheckboxModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    AppRoutingModule, MatButtonModule, MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule
  ],
  providers: [
    provideAnimationsAsync(), { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

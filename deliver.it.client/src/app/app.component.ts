import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {RouterModule} from '@angular/router';
import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import { AuthService } from './auth.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {

  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit() {
    //localStorage.removeItem('token');
    //this.authService.logout();
  }

  

  title = 'deliver.it.client';
}

import { Component, NgModule, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-navbar',
  standalone: false,

  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;
  isManager: boolean = false;

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar ) { }
  ngOnInit(): void {
    this.authService.isAdmin().subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
    this.authService.isManager().subscribe(isManager => {
      this.isManager = isManager;
    });
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.snackBar.open('Odhlásenie úspešné', '', {
      duration: 3000,
    });
  }
  navigateToAccount(): void {
    this.router.navigate(['/account-panel']);
  }

  toggleSidenav() {
  }
  
}

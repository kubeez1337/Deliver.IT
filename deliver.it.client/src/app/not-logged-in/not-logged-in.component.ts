import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-logged-in',
  standalone: false,
  
  templateUrl: './not-logged-in.component.html',
  styleUrl: './not-logged-in.component.css'
})
export class NotLoggedInComponent {
  constructor(private router: Router) { }
  navigateToLogin(): void {
    this.router.navigate(['/user-login-page']);
  }
}

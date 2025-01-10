import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../models/user.model'
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-login-page',
  standalone: false,

  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {

  hide = signal(true);
  username: string = '';
  password: string = '';
  isAdmin: boolean = false;
  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {

  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  tryLogin(): void {
    if (this.username && this.password) {
      this.authService.login(this.username, this.password).subscribe(
        (response) => {
          //console.log('Login successful', response);
          //alert("Login úspešný");
          
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          console.log('Token stored in localStorage:', response.token); 
          console.log('Role stored in localStorage:', response.role);
          this.isAdmin = response.role === '1';
          this.authService.updateAdminStatus();
          this.snackBar.open('Login was successful', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/new-order']);
        },
        (error) => {
          console.error('Login failed', error);
          alert("Nepodarilo sa prihlásiť");
        }
      );
    } else {
      console.error('Username and password are required');
    }
  }
  verifyAdmin() {
    this.authService.getAllUsers().subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error('Error verifying admin status', error);
      }
    );
  }
  getUserInfo() {
    this.authService.getUser().subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error('Error getting user info', error);
      }
    );

    }
    

}

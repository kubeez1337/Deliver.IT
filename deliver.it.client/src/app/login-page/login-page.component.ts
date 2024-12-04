import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../models/user.model'
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
  constructor(private authService: AuthService) {

  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  tryLogin(): void {
    if (this.username && this.password) {
      this.authService.login(this.username, this.password).subscribe(
        (response) => {
          console.log('Login successful', response);
          localStorage.setItem('token', response.token);  
        },
        (error) => {
          console.error('Login failed', error);
        }
      );
    } else {
      console.error('Username and password are required');
    }
  }
  verifyAdmin() {
    this.authService.isAdmin().subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error('Error verifying admin status', error);
      }
    );
  }
}

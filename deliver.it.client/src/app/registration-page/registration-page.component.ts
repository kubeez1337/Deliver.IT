import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css'],
  standalone: false
})
export class RegistrationPageComponent implements OnInit {
  registrationForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.registrationForm = this.fb.nonNullable.group({
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],

      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void { }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value
      ? null : { mismatch: true };
  }

  register(): void {
    if (this.registrationForm.valid) {
      const { username, firstName, lastName, phoneNumber, email, password } = this.registrationForm.value;
      this.authService.register(username, firstName, lastName, phoneNumber, email, password).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          this.snackBar.open('Registrácia úspešná!', '', {
            duration: 3000,
          });
          this.router.navigate(['/user-login-page']);
        },
        error: (error) => {
          console.error('Registration failed', error);
          alert('Registration failed');
        }
      })
    } else {
      console.error('All fields are required and passwords must match');
    }
  }
}

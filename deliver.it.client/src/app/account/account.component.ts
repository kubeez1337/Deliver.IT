import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { User } from '../models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-account',
  standalone: false,
  
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  accountForm: FormGroup;
  user: User = { id: '', userName: '', firstName: '', lastName: '', phoneNumber: '', email: '', userRole: ''};
  showCourierMessageField: boolean = false;
  isAdmin: boolean = false;
  isCourier: boolean = false;
  hasPendingApplication: boolean = false;
  applications: any[] = []
  constructor(private fb: FormBuilder, private authService: AuthService, private snackBar: MatSnackBar) {
    this.accountForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?\d{9,15}$/)]],
      applyForCourier: [false],
      courierMessage: ['']
    });
  }
  ngOnInit(): void {
    this.authService.getUser().subscribe((user: User) => {
      this.user = user;
      //this.isAdmin = user.userRole === '1';
      this.accountForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber
      });
      if (this.isAdmin) {
        this.loadApplications();
      }
    });
    const roleStatus = this.authService.getUserRole();
    if (roleStatus === '1') {
      this.isAdmin = true;
      this.loadApplications();
    }
    if (roleStatus === '2') {
      this.isCourier = true;
    } else {
      this.checkPendingApplication();
    }

    this.accountForm.get('applyForCourier')?.valueChanges.subscribe(value => {
      this.showCourierMessageField = value;
    });
  }
  saveChanges(): void {
    if (this.accountForm.valid) {
      const updatedUser = { ...this.user, ...this.accountForm.value };
      this.authService.updateUser(updatedUser).subscribe({
        next: () => {
          this.snackBar.open('Aktualizácia informácií úspešná', '', {
            duration: 3000,
          });
        },
        error: (error) => {
          console.error('Error updating user information:', error);
          this.snackBar.open('Aktualizácia informácií neúspešná', '', {
            duration: 3000,
          });
        }
      });
    }
  }
  applyForCourier(): void {
    if (this.accountForm.get('applyForCourier')?.value) {
      const message = this.accountForm.get('courierMessage')?.value;

      this.authService.applyForCourier(message).subscribe({
        next: () => {
          this.snackBar.open('Vaša žiadosť bola odoslaná', '', {
            duration: 3000,
          });
        },
        error: (error) => {
          console.error('Error applying for courier role:', error);
          this.snackBar.open('Vaša žiadosť nebola odoslaná', '', {
            duration: 3000,
          });
        }
      });
    }
  }
  processApplication(applicationId: string, approve: boolean): void {
    this.authService.processCourierApplication(applicationId, approve).subscribe({
      next: () => {
        this.snackBar.open(`Žiadosť ${approve ? 'prijatá' : 'odmietnutá'} úspešne`, '', {
          duration: 3000,
        });
        this.loadApplications();
      },
      error: (error) => {
        console.error('Error processing application:', error);
        this.snackBar.open('Error v spracovaní žiadosti', '', {
          duration: 3000,
        });
      }
    });
  }
  loadApplications(): void {
    this.authService.getCourierApplications().subscribe((applications: any[]) => {
      this.applications = applications;
      console.log(applications);
    });
  }
  checkPendingApplication(): void {
    this.authService.getCourierApplications().subscribe((applications: any[]) => {
      this.hasPendingApplication = applications.some(app => app.userId === this.user.id);
      if (!this.hasPendingApplication) {
        this.accountForm.get('applyForCourier')?.enable();
      }
    });
  }
 
}

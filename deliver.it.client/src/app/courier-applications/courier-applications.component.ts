import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-courier-applications',
  standalone: false,
  
  templateUrl: './courier-applications.component.html',
  styleUrl: './courier-applications.component.css'
})
export class CourierApplicationsComponent implements OnInit {
  applications: any[] = [];

  constructor(private authService: AuthService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.authService.getCourierApplications().subscribe((applications: any[]) => {
      this.applications = applications;
    });
  }

  processApplication(applicationId: string, approve: boolean): void {
    this.authService.processCourierApplication(applicationId, approve).subscribe({
      next: () => {
        this.snackBar.open(`Application ${approve ? 'approved' : 'rejected'} successfully`, '', {
          duration: 3000,
        });
        this.loadApplications();
      },
      error: (error) => {
        console.error('Error processing application:', error);
        this.snackBar.open('Error processing application', '', {
          duration: 3000,
        });
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../restaurant.service';
import { RestaurantRequest } from '../models/restaurant-request.model';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pending-requests',
  templateUrl: './pending-requests.component.html',
  styleUrls: ['./pending-requests.component.css'],
  standalone: false
})
export class PendingRequestsComponent implements OnInit {
  pendingRequests: RestaurantRequest[] = [];
  applications: any[] = [];

  constructor(private restaurantService: RestaurantService, private authService: AuthService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadPendingRequests();
    this.loadCourierApplications();
  }

  loadPendingRequests(): void {
    this.restaurantService.getPendingRequests().subscribe({
      next: (data) => {
        this.pendingRequests = data.map(request => ({
          ...request,
          address: request.address || { street: '', houseNumber: '', city: '' }
        }));
      },
      error: (error) => {
        console.error('Error loading pending requests:', error);
      }
    });
  }

  loadCourierApplications(): void {
    this.authService.getCourierApplications().subscribe({
      next: (data) => {
        this.applications = data;
      },
      error: (error) => {
        console.error('Error loading courier applications:', error);
      }
    });
  }

  approveRequest(requestId: number | undefined): void {
    if (requestId !== undefined) {
      this.restaurantService.approveRequest(requestId).subscribe({
        next: (response) => {
          this.snackBar.open(`Žiadosť úspešne potvrdená`, '', {
            duration: 3000,
          });
          this.loadPendingRequests();
        },
        error: (error) => {
          console.error('Error approving request:', error);
          alert('Error approving request.');
        }
      });
    }
  }

  rejectRequest(requestId: number | undefined): void {
    if (requestId !== undefined) {
      this.restaurantService.rejectRequest(requestId).subscribe({
        next: (response) => {
          this.snackBar.open(`Žiadosť odmietnutá`, '', {
            duration: 3000,
          });
          this.loadPendingRequests();
        },
        error: (error) => {
          console.error('Error rejecting request:', error);
          alert('Error rejecting request.');
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
        this.loadCourierApplications();
      },
      error: (error) => {
        console.error('Error processing application:', error);
        this.snackBar.open('Error v spracovaní žiadosti', '', {
          duration: 3000,
        });
      }
    });
  }
}

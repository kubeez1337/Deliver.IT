import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../restaurant.service';
import { RestaurantRequest } from '../models/restaurant-request.model';

@Component({
  selector: 'app-pending-requests',
  templateUrl: './pending-requests.component.html',
  styleUrls: ['./pending-requests.component.css'],
  standalone: false
})
export class PendingRequestsComponent implements OnInit {
  pendingRequests: RestaurantRequest[] = [];

  constructor(private restaurantService: RestaurantService) { }

  ngOnInit(): void {
    this.loadPendingRequests();
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


  approveRequest(requestId: number | undefined): void {
    if (requestId !== undefined) {
      this.restaurantService.approveRequest(requestId).subscribe({
        next: (response) => {
          alert('Restaurant request approved successfully!');
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
          alert('Restaurant request rejected successfully!');
          this.loadPendingRequests();
        },
        error: (error) => {
          console.error('Error rejecting request:', error);
          alert('Error rejecting request.');
        }
      });
    }
  }
}

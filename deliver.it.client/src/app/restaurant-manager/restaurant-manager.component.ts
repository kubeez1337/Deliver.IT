import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Restaurant } from '../models/restaurant.model';
import { User } from '../models/user.model';
import { RestaurantService } from '../restaurant.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-restaurant-manager',
  standalone: false,
  
  templateUrl: './restaurant-manager.component.html',
  styleUrl: './restaurant-manager.component.css'
})
export class RestaurantManagerComponent implements OnInit {
  managerForm: FormGroup;
  users: User[] = [];
  restaurants: Restaurant[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private restaurantService: RestaurantService,
    private snackBar: MatSnackBar
  ) {
    this.managerForm = this.fb.group({
      userId: ['', Validators.required],
      restaurantId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadRestaurants();
  }

  loadUsers(): void {
    this.authService.getAllUsers().subscribe(
      (data: User[]) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  loadRestaurants(): void {
    this.restaurantService.getRestaurants().subscribe(
      (data: Restaurant[]) => {
        this.restaurants = data;
      },
      (error) => {
        console.error('Error fetching restaurants:', error);
      }
    );
  }

  addManager(): void {
    if (this.managerForm.valid) {
      const { userId, restaurantId } = this.managerForm.value;
      this.restaurantService.addManager(userId, restaurantId).subscribe(
        () => {
          this.snackBar.open('Manager added successfully!', '', {
            duration: 3000,
          });
          this.managerForm.reset();
        },
        (error) => {
          console.error('Error adding manager:', error);
          this.snackBar.open('Error adding manager', '', {
            duration: 3000,
          });
        }
      );
    }
  }
  
}

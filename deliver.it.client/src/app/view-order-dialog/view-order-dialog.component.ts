import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Order } from '../models/order.model';
import { Food } from '../models/food.model';
import { FoodService } from '../food.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-view-order-dialog',
  standalone: false,
  
  templateUrl: './view-order-dialog.component.html',
  styleUrl: './view-order-dialog.component.css'
})
export class ViewOrderDialogComponent implements OnInit {
  foods: Food[] = [];
  isAdmin: boolean = false;
  timecl: boolean = false;
  timede: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ViewOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public order: Order,
    private foodService: FoodService, private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.order.timeClaimed) {
      this.timecl = true
    }
    if (this.order.timeDelivered) {
      this.timede = true
    }
    this.loadFoods();
    const role = this.authService.getUserRole();
    if (role == '1') {
      this.isAdmin = true;
    }
  }

  loadFoods(): void {
    this.foodService.getFoods().subscribe(
      (data: Food[]) => {
        this.foods = data;
        this.mapFoodNames();
      },
      (error) => {
        console.error('Error fetching foods:', error);
      }
    );
  }
  mapFoodNames(): void {
    this.order.orderFoods.forEach(orderFood => {
      const food = this.foods.find(f => f.id === orderFood.foodId);
      if (food) {
        orderFood.name = food.name;
      }
    });
  }
  close(): void {
    this.dialogRef.close();
  }
}

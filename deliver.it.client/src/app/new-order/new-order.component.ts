import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FoodService } from '../food.service';
import { Food } from '../models/food.model';
import { Order } from '../models/order.model';
import { OrderService } from '../order.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatSelectModule } from '@angular/material/select';
import { MatSelect} from '@angular/material/select';
import {MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewOrderComponent {
  orderForm: FormGroup;
  availableFoods: Food[] = [];
  selectedFoods: FormArray;
  foodSelected = false;
  selectedFoodQuantity: number = 1;
  selectedFood: any = null;
  //@ViewChild('foodselect') foodselect!: MatSelect;
  constructor(private http: HttpClient, private fb: FormBuilder, private orderService: OrderService, private foodService: FoodService, private cdr: ChangeDetectorRef) {
    this.selectedFoods = this.fb.array([]);
    this.orderForm = this.fb.group({
      customerName: ['', Validators.required],
      customerAddress: ['', Validators.required],
      deliveryGuy: ['', Validators.required],
      selectedFood: this.selectedFood,
      foodItems: this.selectedFoods,
    });
  }
  private apiUrl = 'https://localhost:59038';
  foods: Food[] = [];
  ngOnInit(): void {
    this.foodService.getFoods().subscribe((data: Food[]) => {
      this.availableFoods = data;
    });
  }
  submitOrder() {
    const orderData = this.orderForm.value;
    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        alert('Objednávka bola vytvorená!');
        this.orderForm.reset();
        this.selectedFoods.clear();
        this.foodSelected = false;
      },
      error: (error) => {
        console.error(error);
        alert('Nepodarilo sa vytvoriť objednávku.');
      }
    });
  }
  selectFood(food: Food): void {
    this.selectedFood = food;
  }
  onFoodSelected(event: any) {
    this.selectedFood = event.value;
    //this.foodselect.close();
  }
  addFood(food: Food, quantity: number): void {
    if (food && quantity > 0) {
      const foodGroup = this.fb.group({
        foodId: [food.id, Validators.required],
        name: [food.name],
        quantity: [quantity, [Validators.required, Validators.min(1)]],
      });

      this.selectedFoods.push(foodGroup);
      this.selectedFood = null; // Reset selected food
      this.selectedFoodQuantity = 1; // Reset quantity
    }
    
  }
  incrementQuantity(): void {
    if (this.selectedFoodQuantity < 999) {
      this.selectedFoodQuantity++;
    }
  }

  decrementQuantity(): void {
    if (this.selectedFoodQuantity > 1) {
      this.selectedFoodQuantity--;
    }
  }

  
  updateQuantity(food: any) {
    this.selectedFoodQuantity = food.quantity;
  }
  removeFood(index: number) {
    this.selectedFoods.removeAt(index);
  }
  
}
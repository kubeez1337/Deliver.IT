import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Food } from '../models/food.model';
import { FoodService } from '../food.service';

@Component({
  selector: 'app-edit-order-dialog',
  templateUrl: './edit-order-dialog.component.html',
  standalone: false,
  styleUrls: ['./edit-order-dialog.component.css']
})
export class EditOrderDialogComponent {
  editOrderForm: FormGroup;
  foods: Food[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private foodService: FoodService
  ) {
    this.editOrderForm = this.fb.group({
      customerName: [data.customerName, Validators.required],
      customerAddress: [data.customerAddress, Validators.required],
      phoneNumber: [data.phoneNumber, [Validators.required, Validators.pattern(/^\+?\d{9,15}$/)]],
      //orderFoods: [data.orderFoods, Validators.required]
      orderFoods: this.fb.array([])
    });
  }
  ngOnInit(): void {
    //if (Array.isArray(this.data.orderFoods)) {
    //  this.data.orderFoods = this.data.orderFoods.join(', ');
    //}
    this.setOrderFoods(this.data.orderFoods);
    this.loadFoods();
  }
  save(): void {
    
    if (this.editOrderForm.valid) {
      const orderData = this.editOrderForm.value;
      orderData.totalPrice = this.calculateTotalPrice(orderData.orderFoods);
      this.dialogRef.close(orderData);
      //this.dialogRef.close(this.editOrderForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
  get orderFoods(): FormArray {
    return this.editOrderForm.get('orderFoods') as FormArray;
  }

  setOrderFoods(orderFoods: any[]): void {
    const orderFoodsFormArray = this.editOrderForm.get('orderFoods') as FormArray;
    orderFoods.forEach(orderFood => {
      orderFoodsFormArray.push(this.fb.group({
        foodId: [orderFood.foodId, Validators.required],
        quantity: [orderFood.quantity, Validators.required]
      }));
    });
  }
  loadFoods(): void {
    this.foodService.getFoods().subscribe(
      (data: Food[]) => {
        this.foods = data;
      },
      (error) => {
        console.error('Error fetching foods:', error);
      }
    );
  }
  addOrderFood(): void {
    this.orderFoods.push(this.fb.group({
      foodId: ['', Validators.required],
      quantity: [1, Validators.required]
    }));
  }

  removeOrderFood(index: number): void {
    this.orderFoods.removeAt(index);
  }
  calculateTotalPrice(orderFoods: any[]): number {
    let totalPrice = 0;
    orderFoods.forEach(orderFood => {
      const food = this.foods.find(f => f.id === orderFood.foodId);
      if (food) {
        totalPrice += food.price * orderFood.quantity;
      }
    });
    return totalPrice;
  }
}

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-order-dialog',
  templateUrl: './edit-order-dialog.component.html',
  standalone: false,
  styleUrls: ['./edit-order-dialog.component.css']
})
export class EditOrderDialogComponent {
  editOrderForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.editOrderForm = this.fb.group({
      customerName: [data.customerName, Validators.required],
      customerAddress: [data.customerAddress, Validators.required],
      deliveryGuy: [data.deliveryGuy, Validators.required],
      orderFoods: [data.orderFoods, Validators.required]
    });
  }
  ngOnInit(): void {
    //if (Array.isArray(this.data.orderFoods)) {
    //  this.data.orderFoods = this.data.orderFoods.join(', ');
    //}
  
  }
  save(): void {
    
    if (this.editOrderForm.valid) {
      this.dialogRef.close(this.editOrderForm.value);
    }
  }
}

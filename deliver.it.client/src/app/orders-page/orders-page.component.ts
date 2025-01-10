import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table'
import { MatCheckboxChange } from '@angular/material/checkbox';
import { OrderService } from '../order.service';
import { Order } from '../models/order.model';
import { EditOrderDialogComponent } from '../edit-order-dialog/edit-order-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  standalone: false,
  styleUrls: ['./orders-page.component.css']
})

export class OrdersPageComponent implements OnInit {
  dataSource: MatTableDataSource<Order>;
  constructor(private orderService: OrderService, private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<Order>(this.orders);
  }
  orders: Order[] = [];  
  displayedColumns: string[] = ['select', 'id', 'customerName', 'customerAddress', 'phoneNumber', 'foodItems', 'action'];
  

  ngOnInit() {
    this.loadOrders();

  }
  loadOrders(): void {
      this.orderService.getOrders().subscribe(
        (data: Order[]) => {
          this.orders = data;
          this.dataSource.data = this.orders;
        },
        (error) => {
          console.error('Error fetching orders:', error);
        }
    );
    this.dataSource.data = this.orders;
    }
  toggleSelectAll(event: MatCheckboxChange) {
    const checked = event.checked;
    this.orders.forEach(order => order.selected = checked);
  }
  
  isAllSelected(): boolean {
    return this.orders.every(order => order.selected);
  }

  isIndeterminate(): boolean {
    const selectedOrders = this.orders.filter(order => order.selected).length;
    return selectedOrders > 0 && selectedOrders < this.orders.length;
  }

  deleteSelectedOrders() {
    //this.orders = this.orders.filter(order => !order.selected);
    //this.dataSource.data = this.orders;  // Update table data

    const selectedOrders = this.orders.filter(order => order.selected);
    selectedOrders.forEach(order => {
      this.orderService.deleteOrder(order.id).subscribe({
        next: () => {
          this.orders = this.orders.filter(o => o.id !== order.id);
        },
        error: (error) => {
          console.error('Error deleting order', error);
        }
      });
    });
    this.loadOrders();
  }

  hasSelectedOrders(): boolean {
    return this.orders.some(order => order.selected);
  }

  
  openEditDialog(order: Order, orderId: number): void {
    const dialogRef = this.dialog.open(EditOrderDialogComponent, {
      width: '400px',

      data: { ...order } 
    });

    dialogRef.afterClosed().subscribe((result: Order | null) => {
      if (result) {
        const updatedOrder: Order = {
            ...order,
            ...result, 
          //foodItems: order.foodItems
          //orderFoods: order.orderFoods
          orderFoods: result.orderFoods
        };
        this.orderService.updateOrder(orderId,updatedOrder).subscribe(
          () => {
            const index = this.orders.findIndex(o => o.id === result.id);
            if (index > -1) {
              this.orders[index] = updatedOrder;
              this.dataSource.data = [...this.orders]; 
            }
          },
          (error) => {
            console.error('Error updating order:', error);
          }
        );
      }
      this.loadOrders();

    });
    this.loadOrders();
  }
}

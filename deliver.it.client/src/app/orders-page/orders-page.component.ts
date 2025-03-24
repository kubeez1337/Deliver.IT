import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table'
import { MatCheckboxChange } from '@angular/material/checkbox';
import { OrderService } from '../order.service';
import { Order } from '../models/order.model';
import { EditOrderDialogComponent } from '../edit-order-dialog/edit-order-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';
import { User } from '../models/user.model';
import { ViewOrderDialogComponent } from '../view-order-dialog/view-order-dialog.component';
import { FoodService } from '../food.service';
import { Food } from '../models/food.model';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  standalone: false,
  styleUrls: ['./orders-page.component.css']
})

export class OrdersPageComponent implements OnInit {
  dataSource: MatTableDataSource<Order>;
  isCourier: boolean = false;
  user: User = { id: '', userName: '', firstName: '', lastName: '', phoneNumber: '', email: '', userRole: '' };
  foods: Food[] = [];
  constructor(private orderService: OrderService,private authService: AuthService, private dialog: MatDialog, private snackBar: MatSnackBar, private foodService: FoodService) {
    this.dataSource = new MatTableDataSource<Order>(this.orders);
  }
  orders: Order[] = [];  
  displayedColumns: string[] = ['select', 'id', 'customerName', 'customerAddress', 'phoneNumber', 'foodItems', 'status', 'action', 'claim'];


  ngOnInit() {
    this.loadOrders();
    const roleStatus = this.authService.getUserRole();
    if (roleStatus === '2') {
      this.isCourier = true;
    }
    this.authService.getUser().subscribe((user: User) => {
      this.user = user;
    });

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
          orderFoods: result.orderFoods
        };
        this.orderService.updateOrder(orderId,updatedOrder).subscribe(
          () => {
            const index = this.orders.findIndex(o => o.id === result.id);
            if (index > -1) {
              this.orders[index] = updatedOrder;
              this.dataSource.data = [...this.orders]; 
            }
            this.loadOrders();
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
  claimOrder(orderId: number): void {
    this.orderService.claimOrder(orderId).subscribe({
      next: () => {
        this.snackBar.open('Objednávka úspešne potvrdená', '', {
          duration: 3000,
        });
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error claiming order:', error);
        this.snackBar.open('Error claiming order', '', {
          duration: 3000,
        });
      }
    });
  }
  deliverOrder(orderId: number): void {
    this.orderService.deliverOrder(orderId).subscribe({
      next: () => {
        this.snackBar.open('Objednávka úspešne doručená', '', {
          duration: 3000,
        });
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error delivering order:', error);
        this.snackBar.open('Error delivering order', '', {
          duration: 3000,
        });
      }
    });
  }
  viewOrder(order: Order): void {
    this.dialog.open(ViewOrderDialogComponent, {
      width: '400px',
      data: order
    });
  }
  private calculateTotalPrice(orderFoods: any[]): number {
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

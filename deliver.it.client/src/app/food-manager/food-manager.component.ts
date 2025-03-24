import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Food } from '../models/food.model';
import { AuthService } from '../auth.service';
import { saveAs } from 'file-saver';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observer } from 'rxjs';
import { Restaurant } from '../models/restaurant.model';
import { RestaurantService } from '../restaurant.service';

@Component({
  selector: 'app-food-manager',
  standalone: false,
  
  templateUrl: './food-manager.component.html',
  styleUrl: './food-manager.component.css'
})
export class FoodManagerComponent implements OnInit {
  foods: Food[] = [];
  selectedFile: File | null = null;
  displayedColumns: string[] = ['select','id', 'name', 'price','picture'];
  selection = new SelectionModel<Food>(true, []);
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>; 
  managedRestaurants: Restaurant[] = [];
  selectedRestaurant: Restaurant | null = null;
  selectedRestaurantId: number | null = null;
  constructor(private authService: AuthService, private snackBar: MatSnackBar, private cdr: ChangeDetectorRef, private restaurantService: RestaurantService) { }

  ngOnInit(): void {
    this.loadManagedRestaurants();
    //this.getFoods();
  }
  loadManagedRestaurants(): void {
    this.restaurantService.getManagedRestaurants().subscribe(
      (data: Restaurant[]) => {
        this.managedRestaurants = data;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching managed restaurants:', error);
      }
    );
  }
  onRestaurantSelected(restaurant: Restaurant): void {
    this.selectedRestaurant = restaurant;
    this.selectedRestaurantId = restaurant.id;
    this.getFoods();
  }
  getFoods(): void {
    if (!this.selectedRestaurant) {
      return;
    }

    const observer: Observer<Food[]> = {
      next: (response) => {
        this.foods = response;
        this.cdr.detectChanges(); // Trigger change detection
      },
      error: (error) => {
        console.error('Error fetching foods', error);
      },
      complete: () => { }
    };
    this.authService.getFoodsByRestaurant(this.selectedRestaurant.id).subscribe(observer);
  }
  toggleRow(food: Food) {
    this.selection.toggle(food);
  }
  updateFood(food: Food): void {
    this.authService.updateFood(food).subscribe(
      (response) => {
        this.snackBar.open('Jedla uspesne obnovene!', '', {
          duration: 3000,
        });
        this.getFoods();
      },
      (error) => {
        console.error('Error updating food', error);
        this.snackBar.open('Nastal error v obnove jedla', '', {
          duration: 3000,
        });
      }
    );
  }
  saveAllFoods(): void {
    const newFoods = this.foods.filter(food => food.id === 0);
    const existingFoods = this.foods.filter(food => food.id !== 0);

    if (newFoods.length > 0) {
      this.authService.addFoods(newFoods, this.selectedRestaurantId).subscribe(
        (response) => {
          //console.log('New foods added successfully', response);
          this.snackBar.open('Pridanie jedla úspešné!', '', {
            duration: 3000,
          });
          this.getFoods();
        },
        (error) => {
          console.error('Error adding new foods', error);
          alert('Error adding new foods');
        }
      );
    }

    if (existingFoods.length > 0) {
      this.authService.updateFoods(existingFoods, this.selectedRestaurantId).subscribe(
        (response) => {
          this.snackBar.open('Update jedálničku úspešný!', '', {
            duration: 3000,
          });
          //alert('Foods updated successfully!');
        },
        (error) => {
          console.error('Error updating foods', error);
          alert('Error updating foods');
        }
      );
    }
  }
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }
  deleteSelectedFoods(): void {
    const selectedFoodIds = this.selection.selected.map(food => food.id);
    this.authService.deleteFoods(selectedFoodIds).subscribe(
      (response) => {
        this.snackBar.open('Vymazanie jedál úspešné', '', {
          duration: 3000,
        });
        this.getFoods();
      },
      (error) => {
        console.error('Error deleting foods', error);
        this.snackBar.open('Vymazanie jedál neúspešné', '', {
          duration: 3000,
        });
      }
    );
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.foods.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.foods.forEach(row => this.selection.select(row));
  }

  triggerFileInputClick(): void {
    this.fileInput.nativeElement.click();
  }
  uploadFoods(): void {
    if (this.selectedFile) {
      this.authService.uploadFoods(this.selectedFile).subscribe(
        (response) => {
          this.snackBar.open('Upload jedálničku úspešný!', '', {
            duration: 3000,
          });
          this.getFoods(); 
        },
        (error) => {
          console.error('Error uploading foods', error);
          alert('Error uploading foods');
        }
      );
    } else {
      console.error('No file selected');
      this.snackBar.open('Nebol zvolený žiaden súbor!', '', {
        duration: 3000,
      });
    }
  }

  exportFoods(): void {
    this.authService.exportFoods().subscribe(
      (response) => {
        const blob = new Blob([response], { type: 'application/json' });
        const fileName = prompt('Pomenujte exportovaný súbor', 'foods.json');
        if (fileName) {
          saveAs(blob, fileName);
        }
      },
      (error) => {
        console.error('Error exporting foods', error);
        alert('Error exporting foods');
      }
    );
  }
  addFood(): void {
    var newId = 0;
    if (this.selectedRestaurant) {
      newId = this.selectedRestaurant.id;
    }
    const newFood: Food = { id: 0 , name: '', price: 0, quantity: 0, restaurantId:  newId};
    this.foods = [...this.foods, newFood];
  }
  onPictureSelected(event: any, food: Food): void {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const observer: Observer<any> = {
        next: (response: any) => {
          food.picturePath = response.picturePath;
          this.updateFood(food);
          this.getFoods(); // Refresh the list of foods
        },
        error: (error) => {
          console.error('Error uploading picture', error);
          this.snackBar.open('Nastal error v nahrávaní obrázka', '', {
            duration: 3000,
          });
        },
        complete: () => { }
      };
      this.authService.uploadFoodPicture(food.id, formData).subscribe(observer);
    }
  }
}

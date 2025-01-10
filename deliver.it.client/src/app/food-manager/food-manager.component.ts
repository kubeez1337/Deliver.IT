import { Component, OnInit } from '@angular/core';
import { Food } from '../models/food.model';
import { AuthService } from '../auth.service';
import { saveAs } from 'file-saver';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-food-manager',
  standalone: false,
  
  templateUrl: './food-manager.component.html',
  styleUrl: './food-manager.component.css'
})
export class FoodManagerComponent implements OnInit {
  foods: Food[] = [];
  selectedFile: File | null = null;
  displayedColumns: string[] = ['select','id', 'name', 'price'];
  selection = new SelectionModel<Food>(true, []);
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.getFoods();
  }
  getFoods(): void {
    this.authService.getFoods().subscribe(
      (response) => {
        this.foods = response;
      },
      (error) => {
        console.error('Error fetching foods', error);
      }
    );
  }
  updateFood(food: Food): void {
    this.authService.updateFood(food).subscribe(
      (response) => {
        console.log('Food updated successfully', response);
        alert('Food updated successfully!');
      },
      (error) => {
        console.error('Error updating food', error);
        alert('Error updating food');
      }
    );
  }
  saveAllFoods(): void {
    this.authService.updateFoods(this.foods).subscribe(
      (response) => {
        console.log('Foods updated successfully', response);
        alert('Foods updated successfully!');
      },
      (error) => {
        console.error('Error updating foods', error);
        alert('Error updating foods');
      }
    );
  }
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }
  deleteSelectedFoods(): void {
    const selectedFoodIds = this.selection.selected.map(food => food.id);
    this.authService.deleteFoods(selectedFoodIds).subscribe(
      (response) => {
        console.log('Foods deleted successfully', response);
        alert('Foods deleted successfully!');
        this.getFoods();
      },
      (error) => {
        console.error('Error deleting foods', error);
        alert('Error deleting foods');
      }
    );
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.foods.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.foods.forEach(row => this.selection.select(row));
  }
  uploadFoods(): void {
    if (this.selectedFile) {
      this.authService.uploadFoods(this.selectedFile).subscribe(
        (response) => {
          console.log('Foods uploaded successfully', response);
          alert('Foods uploaded successfully!');
          this.getFoods(); 
        },
        (error) => {
          console.error('Error uploading foods', error);
          alert('Error uploading foods');
        }
      );
    } else {
      console.error('No file selected');
      alert('No file selected');
    }
  }

  exportFoods(): void {
    this.authService.exportFoods().subscribe(
      (response) => {
        const blob = new Blob([response], { type: 'application/json' });
        const fileName = prompt('Enter the file name', 'foods.json');
        if (fileName) {
          saveAs(blob, fileName);
          console.log('Foods exported successfully');
        }
      },
      (error) => {
        console.error('Error exporting foods', error);
        alert('Error exporting foods');
      }
    );
  }

}

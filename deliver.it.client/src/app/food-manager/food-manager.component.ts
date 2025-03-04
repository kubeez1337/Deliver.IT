import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Food } from '../models/food.model';
import { AuthService } from '../auth.service';
import { saveAs } from 'file-saver';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>; 

  constructor(private authService: AuthService, private snackBar: MatSnackBar) { }

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
  toggleRow(food: Food) {
    this.selection.toggle(food);
  }
  updateFood(food: Food): void {
    this.authService.updateFood(food).subscribe(
      (response) => {
        //console.log('Food updated successfully', response);
        //alert('Food updated successfully!');
        //this.snackBar.open('Jedlá sa úspešne obnovili', '', {
        //  duration: 3000,
        //});
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
      this.authService.addFoods(newFoods).subscribe(
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
      this.authService.updateFoods(existingFoods).subscribe(
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
        //console.log('Foods deleted successfully', response);
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
          //console.log('Foods uploaded successfully', response);
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
          //console.log('Foods exported successfully');
        }
      },
      (error) => {
        console.error('Error exporting foods', error);
        alert('Error exporting foods');
      }
    );
  }
  addFood(): void {
    const newFood: Food = { id: 0, name: '', price: 0, quantity: 0 };
    this.foods = [...this.foods, newFood];
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { OrderBuilderService } from '../../core/services/order-builder.service';
import { Arrangement } from '../../core/models/arrangement.model'; // Assuming the model is here
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-arrangement',
  templateUrl: './create-arrangement.component.html',
  styleUrls: ['./create-arrangement.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class CreateArrangementComponent implements OnInit {
  arrangementForm!: FormGroup;
  styles = [
    { name: 'Clásico', value: 'clasico', image: 'assets/style-clasico.jpg' },
    { name: 'Moderno', value: 'moderno', image: 'assets/style-moderno.jpg' },
    { name: 'Romántico', value: 'romantico', image: 'assets/style-romantico.jpg' },
  ];
  sizes = [
    { name: 'Chico', value: 'small', price: 100 },
    { name: 'Mediano', value: 'medium', price: 150 },
    { name: 'Grande', value: 'large', price: 200 },
  ];
  colorPalettes = [
    { name: 'Rojos', value: 'reds', class: 'color-reds' },
    { name: 'Pasteles', value: 'pastels', class: 'color-pastels' },
    { name: 'Vivos', value: 'vivid', class: 'color-vivid' },
  ];
  extras = [
    { name: 'Tarjeta', value: 'card', price: 20, selected: false },
    { name: 'Chocolates', value: 'chocolates', price: 30, selected: false },
    { name: 'Peluche', value: 'plushie', price: 50, selected: false },
  ];

  totalAmount: number = 0;

  constructor(private fb: FormBuilder, private router: Router, private orderBuilderService: OrderBuilderService) {}

  ngOnInit(): void {
    this.arrangementForm = this.fb.group({
      selectedStyle: [null, Validators.required],
      selectedSize: [null, Validators.required],
      selectedColorPalette: [null, Validators.required],
      dedication: ['', [Validators.maxLength(250)]],
      // Initialize form array for checkboxes, each extra has a boolean control
      selectedExtras: this.fb.array(this.extras.map(extra => new FormControl(extra.selected)))
    });

    // Listen for changes to update total dynamically
    this.arrangementForm.valueChanges.subscribe(() => {
      this.calculateTotal();
    });
    this.calculateTotal(); // Initial calculation
  }

  get selectedExtras(): FormArray {
    return this.arrangementForm.get('selectedExtras') as FormArray;
  }

  getExtraControl(index: number): FormControl {
    return this.selectedExtras.at(index) as FormControl;
  }

  calculateTotal(): void {
    let currentTotal = 0;

    const selectedSize = this.sizes.find(
      (s) => s.value === this.arrangementForm.get('selectedSize')?.value
    );
    if (selectedSize) {
      currentTotal += selectedSize.price;
    }

    // Iterate through the FormArray to sum selected extras
    const selectedExtrasControls = (this.arrangementForm.get('selectedExtras') as FormArray).controls;
    selectedExtrasControls.forEach((control: AbstractControl, index: number) => {
      if (control.value) { // If checkbox is selected
        currentTotal += this.extras[index].price;
      }
    });

    this.totalAmount = currentTotal;
  }

  selectStyle(styleValue: string): void {
    this.arrangementForm.get('selectedStyle')?.setValue(styleValue);
  }

  selectSize(sizeValue: string): void {
    this.arrangementForm.get('selectedSize')?.setValue(sizeValue);
  }

  selectColorPalette(colorValue: string): void {
    this.arrangementForm.get('selectedColorPalette')?.setValue(colorValue);
  }

  toggleExtra(index: number): void {
    const control = this.selectedExtras.at(index);
    control.setValue(!control.value);
  }

  onSubmit(): void {
    if (this.arrangementForm.valid) {
      // You would typically send this data to a service
      console.log('Arrangement Data:', this.arrangementForm.value);
      console.log('Total Amount:', this.totalAmount);
      this.orderBuilderService.setArrangementData({
        total_amount: this.totalAmount
      });
      // Navigate to the next step
      this.router.navigate(['/entrega']);
    } else {
      // Mark all fields as touched to show validation messages
      this.arrangementForm.markAllAsTouched();
    }
  }
}

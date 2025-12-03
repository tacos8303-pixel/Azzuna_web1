import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { OrderBuilderService } from '../../core/services/order-builder.service';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, BsDatepickerModule]
})
export class DeliveryComponent implements OnInit {
  deliveryForm!: FormGroup;
  bsConfig?: Partial<BsDatepickerConfig>;

  constructor(private fb: FormBuilder, private router: Router, private orderBuilderService: OrderBuilderService) {
    this.bsConfig = Object.assign(
      {},
      { containerClass: 'theme-red', showWeekNumbers: false, dateInputFormat: 'DD/MM/YYYY' }
    );
  }

  ngOnInit(): void {
    this.deliveryForm = this.fb.group({
      deliveryDate: [null, Validators.required],
      deliveryTime: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]], // Basic postal code regex
      isSurprise: [false],
      instructions: ['', Validators.maxLength(500)],
    });
  }

  onSubmit(): void {
    if (this.deliveryForm.valid) {
      console.log('Delivery Data:', this.deliveryForm.value);
      this.orderBuilderService.setDeliveryData(this.deliveryForm.value);
      this.router.navigate(['/destinatario']);
    } else {
      this.deliveryForm.markAllAsTouched();
    }
  }
}

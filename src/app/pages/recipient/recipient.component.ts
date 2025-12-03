import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { OrderBuilderService } from '../../core/services/order-builder.service';
import { OrdersService } from '../../core/services/orders.service';
import { Order } from '../../core/models/order.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipient',
  templateUrl: './recipient.component.html',
  styleUrls: ['./recipient.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class RecipientComponent implements OnInit {
  recipientForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private orderBuilderService: OrderBuilderService,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    this.recipientForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Basic 10-digit phone number validation
      address: ['', Validators.required],
      additionalDetails: ['', Validators.maxLength(500)],
      cardMessage: ['', Validators.maxLength(250)],
    });
  }

  onSubmit(): void {
    if (this.recipientForm.valid) {
      this.orderBuilderService.setRecipientData(this.recipientForm.value);

      const assembledOrderData = this.orderBuilderService.assembleOrder();

      // Placeholder for client_id, assuming it's available elsewhere or fixed for now
      // A more robust solution would get client_id from user login or selection
      const finalOrder: Partial<Order> = assembledOrderData;

      this.ordersService.createOrder(finalOrder).subscribe({
        next: (newOrder) => {
          this.orderBuilderService.resetOrderData(); // Clear collected data
          this.router.navigate(['/pago'], { state: { order: newOrder } });
        },
        error: (err) => {
          console.error('Error creating order:', err);
          alert('Error al crear el pedido. Por favor, inténtalo de nuevo.');
        }
      });
    } else {
      this.recipientForm.markAllAsTouched();
    }
  }
}

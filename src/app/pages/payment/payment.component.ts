import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class PaymentComponent implements OnInit {
  paymentForm!: FormGroup;
  paymentMethods = [
    { name: 'Tarjeta de Crédito/Débito', value: 'card' },
    { name: 'PayPal', value: 'paypal' },
    { name: 'Transferencia Bancaria', value: 'bank_transfer' },
  ];
  orderSummary: Partial<Order> | null = null;
  currentOrder: Order | null = null; // New property to hold the full order object

  constructor(private fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      selectedPaymentMethod: ['', Validators.required],
      cardNumber: [''],
      expiryDate: [''],
      cvc: ['']
    });

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['order']) {
      this.currentOrder = navigation.extras.state['order'] as Order;
      // Populate orderSummary ensuring all template-expected fields have values
      this.orderSummary = {
        id: this.currentOrder.id ?? 0, // Default to 0 if null
        client_id: this.currentOrder.client_id ?? 0,
        arrangement_id: this.currentOrder.arrangement_id ?? 0,
        delivery_date: this.currentOrder.delivery_date ?? new Date().toISOString().slice(0,10),
        total_amount: this.currentOrder.total_amount ?? 0,
        payment_status: this.currentOrder.payment_status ?? 'pending',
        status: this.currentOrder.status ?? 'pending',
        recipient_name: this.currentOrder.recipient_name ?? 'N/A',
        recipient_phone: this.currentOrder.recipient_phone ?? 'N/A',
        recipient_address: this.currentOrder.recipient_address ?? 'N/A',
        notes: this.currentOrder.notes ?? ''
      };
    } else {
      console.warn('No order data found for payment confirmation. Displaying mock data.');
      // Fallback to mock data if no order is passed
      this.currentOrder = { // Populate currentOrder directly
        id: 999,
        client_id: 1,
        arrangement_id: 1,
        delivery_date: '2025-12-31',
        total_amount: 1000,
        payment_status: 'pending',
        status: 'pending',
        recipient_name: 'Mock Recipient',
        recipient_phone: '1234567890',
        recipient_address: 'Mock Address 123',
        notes: 'Mock notes for testing.'
      } as Order; // Cast to Order type
      this.orderSummary = { ...this.currentOrder }; // Populate orderSummary from currentOrder
    }

    // Conditional validation for card details
    this.paymentForm.get('selectedPaymentMethod')?.valueChanges.subscribe(method => {
      const cardNumberControl = this.paymentForm.get('cardNumber');
      const expiryDateControl = this.paymentForm.get('expiryDate');
      const cvcControl = this.paymentForm.get('cvc');

      if (method === 'card') {
        cardNumberControl?.setValidators([Validators.required, Validators.pattern('^[0-9]{16}$')]);
        expiryDateControl?.setValidators([Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\\/[0-9]{2}$')]); // MM/YY format
        cvcControl?.setValidators([Validators.required, Validators.pattern('^[0-9]{3,4}$')]); // 3 or 4 digits
      } else {
        // Clear validators if not card payment
        cardNumberControl?.clearValidators();
        expiryDateControl?.clearValidators();
        cvcControl?.clearValidators();
      }
      // Update validity after changing validators
      cardNumberControl?.updateValueAndValidity();
      expiryDateControl?.updateValueAndValidity();
      cvcControl?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      // Here you would integrate with a payment gateway (e.g., call a service)
      alert('¡Pedido realizado con éxito!'); // Simple alert for now
      this.router.navigate(['/dashboard']); // Redirect to dashboard or order confirmation page
    } else {
      this.paymentForm.markAllAsTouched(); // Show validation errors
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

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
  orderSummary = {
    arrangementDetails: 'Arreglo Clásico, Mediano, Paleta Rojos, con Tarjeta y Chocolates', // Mock data
    total: 200 + 20 + 30, // Example total from previous step
    deliveryInfo: 'Entrega el 30/11/2025 a las 14:00 en Calle Falsa 123', // Mock data
    recipientInfo: 'Destinatario: Jane Doe, Tel: 5512345678', // Mock data
  };

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      selectedPaymentMethod: ['', Validators.required],
      cardNumber: [''],
      expiryDate: [''],
      cvc: ['']
    });

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
      console.log('Payment Data:', this.paymentForm.value);
      // Here you would integrate with a payment gateway (e.g., call a service)
      alert('¡Pedido realizado con éxito!'); // Simple alert for now
      this.router.navigate(['/dashboard']); // Redirect to dashboard or order confirmation page
    } else {
      this.paymentForm.markAllAsTouched(); // Show validation errors
    }
  }
}

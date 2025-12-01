import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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

  constructor(private fb: FormBuilder, private router: Router) {}

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
      console.log('Recipient Data:', this.recipientForm.value);
      this.router.navigate(['/pago']);
    } else {
      this.recipientForm.markAllAsTouched();
    }
  }
}

import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { OrdersService } from '../../core/services/orders.service';
import { BsModalService, BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { Order, OrderStatus } from '../../core/models/order.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, BsDatepickerModule, ModalModule]
})
export class OrdersComponent implements OnInit {

  // Helper to normalize status for ngClass and get Spanish display
  // This helps handle potential inconsistencies in data where status might be in Spanish
  getNormalizedStatus(status: string | OrderStatus): OrderStatus {
    switch (status) {
      case 'pendiente':
      case 'pending':
        return 'pending';
      case 'en_camino':
      case 'in_progress':
        return 'in_progress';
      case 'entregado':
      case 'completed':
        return 'completed';
      default:
        // Default to 'pending' if an unknown status is encountered
        return 'pending';
    }
  }

  // Update getStatusInSpanish to use the normalized status for display
  getStatusInSpanish(status: string | OrderStatus): string {
    const normalizedStatus = this.getNormalizedStatus(status);
    switch (normalizedStatus) {
      case 'pending':
        return 'Pendiente';
      case 'in_progress':
        return 'En Camino';
      case 'completed':
        return 'Entregado';
      default:
        return String(status); // Fallback, though getNormalizedStatus should prevent this
    }
  }

  orders: Order[] = [];
  filteredOrders: Order[] = [];

  modalRef?: BsModalRef;
  orderForm!: FormGroup;
  isEditMode = false;
  currentOrderId?: number;

  filterForm!: FormGroup;

  constructor(
    private ordersService: OrdersService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initFilterForm();
    this.initOrderForm();
    this.loadOrders();

    this.filterForm.valueChanges.subscribe(() => this.applyFilters());
  }

  initFilterForm(): void {
    this.filterForm = this.fb.group({
      searchTerm: [''],
      status: ['all'],
    });
  }

  initOrderForm(order?: Order): void {
    this.isEditMode = !!order;
    this.currentOrderId = order?.id;

    this.orderForm = this.fb.group({
      client_id: [order?.client_id ?? null, Validators.required],
      arrangement_id: [order?.arrangement_id ?? null, Validators.required],
      delivery_date: [order ? new Date(order.delivery_date) : null, Validators.required],
      total_amount: [order?.total_amount ?? null, Validators.required],
      status: [order?.status ?? 'pending', Validators.required],
      payment_status: [order?.payment_status ?? 'pending', Validators.required],
      recipient_name: [order?.recipient_name ?? '', Validators.required],
      recipient_phone: [order?.recipient_phone ?? '', Validators.required],
      recipient_address: [order?.recipient_address ?? '', Validators.required],
      notes: [order?.notes ?? '']
    });
  }

  loadOrders() {
    this.ordersService.getOrders().subscribe(data => {
      this.orders = data;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    const { searchTerm, status } = this.filterForm.value;
    let result = [...this.orders];

    if (status !== 'all') {
      result = result.filter(o => o.status === status);
    }

    if (searchTerm) {
      const st = searchTerm.toLowerCase();
      result = result.filter(o =>
        o.id?.toString().includes(st) ||
        o.client_id.toString().includes(st)
      );
    }

    this.filteredOrders = result;
  }

  openModal(template: TemplateRef<any>, order?: Order): void {
    this.initOrderForm(order);
    this.modalRef = this.modalService.show(template);
  }

  formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  saveOrder(): void {
    if (!this.orderForm.valid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    const data: Partial<Order> = {
      ...this.orderForm.value,
      delivery_date: this.formatDate(this.orderForm.value.delivery_date)
    };

    if (this.isEditMode && this.currentOrderId) {
      this.ordersService.updateOrder(this.currentOrderId, data).subscribe({
        next: () => {
          this.loadOrders();
          this.modalRef?.hide();
        },
        error: (err) => {
          console.error('Error updating order:', err);
          this.loadOrders(); // Reload orders even on error
        }
      });
    } else {
      this.ordersService.createOrder(data).subscribe({
        next: () => {
          this.modalRef?.hide();
          this.loadOrders();
        },
        error: (err) => {
          console.error('Error creating order:', err);
          this.loadOrders(); // Reload orders even on error
        }
      });
    }
  }

  deleteOrder(id: number) {
    if (!id) return;
    this.ordersService.deleteOrder(id).subscribe(() => {
      this.loadOrders();
    });
  }
}

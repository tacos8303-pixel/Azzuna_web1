import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { OrdersService } from '../../core/services/orders.service';
import { Order } from '../../core/models/order.model';
import { BsModalService, BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, BsDatepickerModule, ModalModule]
})
export class OrdersComponent implements OnInit {
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
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initFilterForm();
    this.initOrderForm();
    this.loadOrders();

    // Listen for filter changes
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
    // This form is for the modal, pre-populating fields for editing.
    this.orderForm = this.fb.group({
      id: [order?.id],
      client_id: [order?.client_id, Validators.required],
      delivery_date: [order ? new Date(order.delivery_date) : null, Validators.required], // Assuming date string from backend
      total_amount: [order?.total_amount, Validators.required],
      status: [order?.status, Validators.required],
      payment_status: [order?.payment_status, Validators.required],
      // For a real full CRUD, you would include all Order fields
      // and potentially fetch related data (like client names).
    });
  }

  loadOrders(): void {
    this.ordersService.getOrders().subscribe({
      next: (data: Order[]) => {
        this.orders = data;
        this.applyFilters(); // Apply initial filters
      },
      error: (err: any) => console.error('Error fetching orders:', err),
    });
  }
  
  applyFilters(): void {
    const { searchTerm, status } = this.filterForm.value;
    let tempOrders = [...this.orders];

    // Filter by status
    if (status !== 'all') {
      tempOrders = tempOrders.filter(order => order.status === status);
    }

    // Filter by search term (on order ID or client ID)
    if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        tempOrders = tempOrders.filter(order => 
            order.id?.toString().includes(lowerCaseSearchTerm) ||
            order.client_id.toString().includes(lowerCaseSearchTerm)
        );
    }

    this.filteredOrders = tempOrders;
  }

  openModal(template: TemplateRef<any>, order?: Order): void {
    this.initOrderForm(order);
    this.modalRef = this.modalService.show(template);
  }

  saveOrder(): void {
    if (!this.orderForm.valid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    // We assume all fields from the form make up the order object for the update
    const orderData: Order = this.orderForm.value;

    if (this.isEditMode && this.currentOrderId) {
      this.ordersService.updateOrder(this.currentOrderId, orderData).subscribe({
        next: () => {
          this.loadOrders(); // Refresh data
          this.modalRef?.hide();
          // Optionally, add a success notification
        },
        error: (err: any) => console.error('Error updating order:', err),
      });
    }
  }

  deleteOrder(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este pedido?')) {
      this.ordersService.deleteOrder(id).subscribe({
        next: () => {
          this.loadOrders(); // Refresh data
          // Optionally, add a success notification
        },
        error: (err: any) => console.error('Error deleting order:', err),
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../core/services/orders.service';
import { Order } from '../../core/models/order.model';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pickups',
  templateUrl: './pickups.component.html',
  styleUrls: ['./pickups.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class PickupsComponent implements OnInit {
  pickupOrders: Order[] = [];

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.loadPickupOrders();
  }

  loadPickupOrders(): void {
    this.ordersService.getOrders().pipe(
      // For this example, we'll consider orders 'pending' or 'in_transit' as "por recoger"
      map((orders: Order[]) => orders.filter(order => order.status === 'pending' || order.status === 'in_transit'))
    ).subscribe({
      next: (data: Order[]) => {
        this.pickupOrders = data;
      },
      error: (err: any) => console.error('Error fetching pickup orders:', err),
    });
  }

  printOrder(orderId: number | undefined): void {
    if (!orderId) return;
    // In a real app, this would open a print-friendly view or generate a PDF.
    alert(`Imprimiendo ticket para el pedido #${orderId}... (funcionalidad simulada)`);
    // A real implementation would be more complex and might involve a new component/service
    // window.print(); // Avoid this as it prints the whole page
  }

  markAsPickedUp(order: Order): void {
    if (confirm(`¿Marcar el pedido #${order.id} como recogido?`)) {
      const updatedOrder = { ...order, status: 'picked_up' as const };
      if (order.id) {
        this.ordersService.updateOrder(order.id, updatedOrder).subscribe({
          next: () => {
            this.loadPickupOrders(); // Refresh the list
          },
          error: (err: any) => console.error('Error updating order status:', err)
        });
      }
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, BsDatepickerModule]
})
export class DashboardComponent implements OnInit {
  pendingOrders: number = 15; // Mock data
  pickupOrders: number = 8; // Mock data
  reminders: string[] = [
    'Revisar pedidos pendientes de hoy',
    'Contactar a Juan Pérez sobre arreglo especial',
    'Preparar entrega para mañana a las 10 AM',
  ];

  bsConfig?: Partial<BsDatepickerConfig>; // Optional configuration for datepicker

  constructor() {
    // Configure datepicker to show today's date highlighted
    this.bsConfig = Object.assign({}, { containerClass: 'theme-red', showWeekNumbers: false });
  }

  ngOnInit(): void {
    // Initialization logic if any
  }
}

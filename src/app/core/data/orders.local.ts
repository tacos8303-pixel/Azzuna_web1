// src/app/core/data/orders.local.ts
import { Order } from '../models/order.model';

export const LOCAL_ORDERS: Order[] = [
  {
    id: 1,
    client_id: 1,
    arrangement_id: 2,
    delivery_date: '2025-12-02',
    total_amount: 550,
    status: 'pending',
    payment_status: 'pending',
    recipient_name: 'Laura Gómez',
    recipient_phone: '9997778899',
    recipient_address: 'Casa #21',
    notes: 'Entrega normal'
  },
  {
    id: 2,
    client_id: 2,
    arrangement_id: 1,
    delivery_date: '2025-12-02',
    total_amount: 300,
    status: 'pending',
    payment_status: 'pending',
    recipient_name: 'César Ruiz',
    recipient_phone: '9998889900',
    recipient_address: 'Sucursal Centro',
    notes: 'Lo recoge 3 PM'
  },
  {
    id: 3,
    client_id: 3,
    arrangement_id: 3,
    delivery_date: '2025-12-03',
    total_amount: 900,
    status: 'completed',
    payment_status: 'paid',
    recipient_name: 'María Herrera',
    recipient_phone: '9991234567',
    recipient_address: 'Edificio Azul',
    notes: 'Urgente'
  },
  {
    id: 4,
    client_id: 4,
    arrangement_id: 4,
    delivery_date: '2025-12-03',
    total_amount: 600,
    status: 'pending',
    payment_status: 'pending',
    recipient_name: 'Alicia Gómez',
    recipient_phone: '9992221111',
    recipient_address: 'Mostrador',
    notes: 'Llega su hijo'
  }
];

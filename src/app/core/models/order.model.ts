export type PaymentStatus = 'pending' | 'paid';
export type OrderStatus = 'pending' | 'in_progress' | 'completed';

export interface Order {
  id: number;
  client_id: number;
  arrangement_id: number;
  delivery_date: string;
  total_amount: number;
  payment_status: PaymentStatus;
  status: OrderStatus;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  notes: string;
}
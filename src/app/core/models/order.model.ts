export interface Order {
  id?: number;
  arrangement_id: number;
  client_id: number;
  delivery_date: string;
  delivery_address: string;
  recipient_name: string;
  total_amount: number;
  status: 'pending' | 'in_transit' | 'delivered' | 'picked_up' | 'cancelled';
  // Campos adicionales del frontend
  delivery_time?: string;
  is_surprise?: boolean;
  delivery_instructions?: string;
  payment_status?: 'pending' | 'paid';
  // Relaciones (opcional, para uso en frontend)
  client?: Client;
  arrangement?: Arrangement;
}

// Importar los otros modelos si se usan las relaciones en el frontend
import { Client } from './client.model';
import { Arrangement } from './arrangement.model';

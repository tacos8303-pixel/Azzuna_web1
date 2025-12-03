import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderBuilderService {
  private currentOrderData: Partial<Order> = {};
  private orderDataSubject = new BehaviorSubject<Partial<Order>>(this.currentOrderData);

  constructor() { }

  setArrangementData(data: { total_amount: number }): void {
    this.currentOrderData = { ...this.currentOrderData, total_amount: data.total_amount, arrangement_id: data.total_amount }; // Using total_amount as a placeholder for arrangement_id for now
    this.orderDataSubject.next(this.currentOrderData);
  }

  setDeliveryData(data: { deliveryDate: Date, deliveryTime: string, address: string, city: string, postalCode: string, isSurprise: boolean, instructions: string }): void {
    this.currentOrderData = {
      ...this.currentOrderData,
      delivery_date: data.deliveryDate.toISOString().slice(0, 10),
      recipient_address: data.address, // Mapping delivery address to recipient address
      notes: data.instructions, // Mapping delivery instructions to order notes
    };
    this.orderDataSubject.next(this.currentOrderData);
  }

  setRecipientData(data: { fullName: string, phone: string, address: string, additionalDetails: string, cardMessage: string }): void {
    this.currentOrderData = {
      ...this.currentOrderData,
      recipient_name: data.fullName,
      recipient_phone: data.phone,
      // Only set recipient_address if it's not already set by delivery data, or if recipient address is meant to override delivery address
      // For now, let's assume delivery address takes precedence for recipient_address in the final order
      // If a separate recipient_address is needed, the Order model needs to be updated.
      notes: data.cardMessage // This might override notes from delivery, decide precedence
    };
    // If recipient's address is intended to be the final address for delivery, uncomment the following:
    // this.currentOrderData.recipient_address = data.address;
    this.orderDataSubject.next(this.currentOrderData);
  }

  // Get the currently collected data
  getCurrentOrderData(): Partial<Order> {
    return this.currentOrderData;
  }

  // Observable for order data changes
  getOrderDataChanges(): Observable<Partial<Order>> {
    return this.orderDataSubject.asObservable();
  }

  // Resets the collected order data
  resetOrderData(): void {
    this.currentOrderData = {};
    this.orderDataSubject.next(this.currentOrderData);
  }

  // Assembles the final order, should be called when all steps are complete
  // Note: client_id and arrangement_id need to be properly set from earlier steps
  assembleOrder(): Partial<Order> {
    const data = this.currentOrderData;
    return {
      client_id: data.client_id ?? 1, // Placeholder: get client_id from a selection component or user context
      arrangement_id: data.arrangement_id ?? 1, // Placeholder: get actual arrangement_id from arrangement selection
      delivery_date: data.delivery_date || '',
      total_amount: data.total_amount || 0,
      payment_status: data.payment_status || 'pending', // Default
      status: data.status || 'pending', // Default
      recipient_name: data.recipient_name || '',
      recipient_phone: data.recipient_phone || '',
      recipient_address: data.recipient_address || '',
      notes: data.notes || '' // Use notes from delivery instructions as primary
      // Additional fields like deliveryTime, deliveryCity etc. are not part of the Order interface
    };
  }
}

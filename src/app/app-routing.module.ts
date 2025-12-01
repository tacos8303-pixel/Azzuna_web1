import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import the components
import { CreateArrangementComponent } from './pages/create-arrangement/create-arrangement.component';
import { DeliveryComponent } from './pages/delivery/delivery.component';
import { RecipientComponent } from './pages/recipient/recipient.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { PickupsComponent } from './pages/pickups/pickups.component';

const routes: Routes = [
  { path: 'crear-arreglo', component: CreateArrangementComponent },
  { path: 'entrega', component: DeliveryComponent },
  { path: 'destinatario', component: RecipientComponent },
  { path: 'pago', component: PaymentComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'pedidos', component: OrdersComponent },
  { path: 'por-recoger', component: PickupsComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/dashboard' } // Wildcard route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private API = 'http://localhost/azzuna_api/';

  constructor(private http: HttpClient) {}

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.API + 'clients_get.php');
  }

  createClient(data: Client): Observable<any> {
    return this.http.post(this.API + 'clients_create.php', data);
  }
}

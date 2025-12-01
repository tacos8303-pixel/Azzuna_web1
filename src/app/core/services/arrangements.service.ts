import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Arrangement } from '../models/arrangement.model';

@Injectable({
  providedIn: 'root',
})
export class ArrangementsService {
  private API = 'http://localhost/azzuna_api/';

  constructor(private http: HttpClient) {}

  getArrangements(): Observable<Arrangement[]> {
    return this.http.get<Arrangement[]>(this.API + 'arrangements_get.php');
  }

  createArrangement(data: Arrangement): Observable<any> {
    return this.http.post(this.API + 'arrangements_create.php', data);
  }
}

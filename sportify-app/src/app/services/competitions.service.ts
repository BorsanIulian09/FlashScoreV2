import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompetitionsResponse } from '../models/competition.model';

@Injectable({
  providedIn: 'root'
})
export class CompetitionsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000';

  getCompetitions(): Observable<CompetitionsResponse> {
    return this.http.get<CompetitionsResponse>(`${this.apiUrl}/competitions`);
  }
}

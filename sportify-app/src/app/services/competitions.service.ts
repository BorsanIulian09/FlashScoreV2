import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompetitionsResponse } from '../models/competition.model';
import { StandingsResponse } from '../models/standings.model';

@Injectable({
  providedIn: 'root'
})
export class CompetitionsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000';

  getCompetitions(): Observable<CompetitionsResponse> {
    return this.http.get<CompetitionsResponse>(`${this.apiUrl}/competitions`);
  }

  getStandings(competitionId: number, season?: number): Observable<StandingsResponse> {
    let url = `${this.apiUrl}/competitions/${competitionId}/standings`;
    if (season) {
      url += `?season=${season}`;
    }
    return this.http.get<StandingsResponse>(url);
  }
}

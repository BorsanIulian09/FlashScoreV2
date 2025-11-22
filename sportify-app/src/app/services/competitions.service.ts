import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompetitionsResponse } from '../models/competition.model';
import { StandingsResponse } from '../models/standings.model';
import { Team } from '../models/team.model';
import { MatchResponse } from '../models/match.model';

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

  getTeam(teamId: number): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/teams/${teamId}`);
  }

  getMatches(competitionId: number, matchday?: number, season?: number): Observable<MatchResponse> {
    let url = `${this.apiUrl}/competitions/${competitionId}/matches`;
    const params: string[] = [];
    if (matchday !== undefined) {
      params.push(`matchday=${matchday}`);
    }
    if (season) {
      params.push(`season=${season}`);
    }
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    return this.http.get<MatchResponse>(url);
  }
}

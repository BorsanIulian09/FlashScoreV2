import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router,RouterLink } from '@angular/router';
import { CompetitionsService } from '../../services/competitions.service';
import { StandingsResponse, TableTeam } from '../../models/standings.model';
import { MatchResponse, Match } from '../../models/match.model';
import { ScorersResponse } from '../../models/scorers.model';

@Component({
  selector: 'app-competition-detail',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './competition-detail.component.html',
  styleUrl: './competition-detail.component.css'
})
export class CompetitionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private competitionsService = inject(CompetitionsService);
  
  standingsData = signal<StandingsResponse | null>(null);
  matchesData = signal<MatchResponse | null>(null);
  scorersData = signal<ScorersResponse | null>(null);
  isLoading = signal(true);
  isLoadingMatches = signal(false);
  isLoadingScorers = signal(false);
  error = signal<string | null>(null);
  competitionId = signal<number | null>(null);
  selectedMatchday = signal<number | null>(null);
  activeTab = signal<'standings' | 'matches' | 'scorers'>('standings');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.competitionId.set(parseInt(id, 10));
      this.loadStandings(parseInt(id, 10));
      this.loadMatches(parseInt(id, 10));
      this.loadScorers(parseInt(id, 10));
    } else {
      this.error.set('Invalid competition ID');
      this.isLoading.set(false);
    }
  }

  loadStandings(competitionId: number, season?: number): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.competitionsService.getStandings(competitionId, season).subscribe({
      next: (response) => {
        this.standingsData.set(response);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading standings:', err);
        this.error.set('Failed to load standings. Please try again later.');
        this.isLoading.set(false);
      }
    });
  }

  get standingsTable(): TableTeam[] {
    const data = this.standingsData();
    if (!data || !data.standings || data.standings.length === 0) {
      return [];
    }
    // Get the first standing (usually TOTAL)
    return data.standings[0]?.table || [];
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  getSeasonYear(dateString: string): string {
    return new Date(dateString).getFullYear().toString();
  }

  goBack(): void {
    this.router.navigate(['/competitions']);
  }

  getPositionClass(position: number): string {
    const data = this.standingsData();
    if (!data || !data.competition) return '';
    
    const totalTeams = this.standingsTable.length;
    const competitionCode = data.competition.code;
    
    // Different zones for different competitions
    // Premier League, La Liga, Serie A, Bundesliga, Ligue 1
    if (['PL', 'PD', 'SA', 'BL1', 'FL1'].includes(competitionCode)) {
      if (position <= 4) return 'champions-league';
      if (position === 5) return 'europa-league';
      if (position === 6) return 'conference-league';
      if (position >= totalTeams - 2) return 'relegation';
    }
    // Champions League zones
    else if (competitionCode === 'CL') {
      if (position <= 2) return 'qualification';
      if (position === 3) return 'europa-league';
    }
    // Default zones
    else {
      if (position <= 2) return 'promotion';
      if (position <= 4) return 'playoff';
      if (position >= totalTeams - 2) return 'relegation';
    }
    
    return '';
  }

  getTeamForm(teamId: number): string[] {
    const matches = this.matchesData()?.matches || [];
    const teamMatches = matches
      .filter(m => 
        m.status === 'FINISHED' && 
        (m.homeTeam.id === teamId || m.awayTeam.id === teamId)
      )
      .sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime())
      .slice(0, 5);

    return teamMatches.map(match => {
      const isHome = match.homeTeam.id === teamId;
      const winner = match.score.winner;

      if (winner === 'DRAW') return 'D';
      if (winner === 'HOME_TEAM') return isHome ? 'W' : 'L';
      if (winner === 'AWAY_TEAM') return isHome ? 'L' : 'W';
      return '';
    }).filter(result => result !== '');
  }

  getGoalDifferenceWidth(goalDiff: number): number {
    const maxGD = Math.max(...this.standingsTable.map(t => Math.abs(t.goalDifference)));
    if (maxGD === 0) return 0;
    return Math.min((Math.abs(goalDiff) / maxGD) * 100, 100);
  }

  viewTeam(teamId: number): void {
    this.router.navigate(['/teams', teamId]);
  }

  loadMatches(competitionId: number): void {
    this.isLoadingMatches.set(true);
    
    // Always fetch all matches to populate the matchday selector
    this.competitionsService.getMatches(competitionId).subscribe({
      next: (response) => {
        this.matchesData.set(response);
        
        // Auto-select current matchday if available
        // Get current matchday from first match's season, or from standings data
        let currentMatchday: number | null = null;
        
        if (response.matches.length > 0 && response.matches[0].season?.currentMatchday) {
          currentMatchday = response.matches[0].season.currentMatchday;
        } else if (this.standingsData()?.season?.currentMatchday) {
          currentMatchday = this.standingsData()!.season.currentMatchday;
        }
        
        if (currentMatchday !== null) {
          this.selectedMatchday.set(currentMatchday);
        } else {
          // If no current matchday, select the first available matchday
          const matchdays = Array.from(new Set(
            response.matches
              .map(m => m.matchday)
              .filter(md => md !== null) as number[]
          )).sort((a, b) => a - b);
          
          if (matchdays.length > 0) {
            this.selectedMatchday.set(matchdays[0]);
          }
        }
        
        this.isLoadingMatches.set(false);
      },
      error: (err) => {
        console.error('Error loading matches:', err);
        this.isLoadingMatches.set(false);
      }
    });
  }

  availableMatchdays = computed(() => {
    const matches = this.matchesData()?.matches || [];
    const matchdays = new Set<number>();
    
    matches.forEach(match => {
      if (match.matchday !== null) {
        matchdays.add(match.matchday);
      }
    });
    
    return Array.from(matchdays).sort((a, b) => a - b);
  });

  filteredMatches = computed(() => {
    const matches = this.matchesData()?.matches || [];
    const selected = this.selectedMatchday();
    
    if (selected === null) {
      return matches;
    }
    
    return matches.filter(match => match.matchday === selected);
  });

  selectMatchday(matchday: number): void {
    this.selectedMatchday.set(matchday);
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  }

  getMatchStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'SCHEDULED': 'scheduled',
      'LIVE': 'live',
      'IN_PLAY': 'live',
      'PAUSED': 'live',
      'FINISHED': 'finished',
      'POSTPONED': 'postponed',
      'CANCELLED': 'cancelled',
      'SUSPENDED': 'suspended'
    };
    return statusMap[status] || 'scheduled';
  }

  setActiveTab(tab: 'standings' | 'matches' | 'scorers'): void {
    this.activeTab.set(tab);
  }

  loadScorers(competitionId: number, limit?: number, season?: number): void {
    this.isLoadingScorers.set(true);
    
    this.competitionsService.getScorers(competitionId, limit, season).subscribe({
      next: (response) => {
        this.scorersData.set(response);
        this.isLoadingScorers.set(false);
      },
      error: (err) => {
        console.error('Error loading scorers:', err);
        this.isLoadingScorers.set(false);
      }
    });
  }

  getAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  // Get competition info from either standings, matches, or scorers data
  getCompetitionInfo() {
    const standings = this.standingsData();
    const matches = this.matchesData();
    const scorers = this.scorersData();
    
    if (standings) {
      return {
        name: standings.competition.name,
        emblem: standings.competition.emblem,
        area: standings.area,
        season: standings.season
      };
    } else if (matches && matches.matches.length > 0) {
      const firstMatch = matches.matches[0];
      return {
        name: firstMatch.competition.name,
        emblem: firstMatch.competition.emblem,
        area: firstMatch.area,
        season: firstMatch.season
      };
    } else if (scorers) {
      return {
        name: scorers.competition.name,
        emblem: scorers.competition.emblem,
        area: null, // Scorers response doesn't have area
        season: scorers.season
      };
    }
    return null;
  }
}
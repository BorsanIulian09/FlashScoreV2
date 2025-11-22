import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CompetitionsService } from '../../services/competitions.service';
import { StandingsResponse, TableTeam } from '../../models/standings.model';

@Component({
  selector: 'app-competition-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './competition-detail.component.html',
  styleUrl: './competition-detail.component.css'
})
export class CompetitionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private competitionsService = inject(CompetitionsService);
  
  standingsData = signal<StandingsResponse | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  competitionId = signal<number | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.competitionId.set(parseInt(id, 10));
      this.loadStandings(parseInt(id, 10));
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
    
    // For most leagues, top 4 is Champions League, 5-7 might be Europa League, etc.
    // This is a simplified version - you can customize based on competition rules
    if (position <= 4) return 'champions-league';
    if (position <= 6) return 'europa-league';
    if (position >= this.standingsTable.length - 3) return 'relegation';
    return '';
  }

  viewTeam(teamId: number): void {
    this.router.navigate(['/teams', teamId]);
  }
}
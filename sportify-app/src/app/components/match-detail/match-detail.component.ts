import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CompetitionsService } from '../../services/competitions.service';
import { Location } from '@angular/common';
import { Head2HeadResponse } from '../../models/match.model';

@Component({
  selector: 'app-match-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './match-detail.component.html',
  styleUrl: './match-detail.component.css'
})
export class MatchDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(CompetitionsService);
  private location = inject(Location);

  match = signal<any | null>(null);
  head2head = signal<Head2HeadResponse | null>(null);
  calculatedStats = signal<{
    homeWins: number;
    awayWins: number;
    draws: number;
  } | null>(null);
  isLoading = signal(true);
  isLoadingH2H = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error.set('Invalid match ID');
      return;
    }

    this.service.getMatchById(id).subscribe({
      next: res => {
        this.match.set(res.match ?? res);
        this.isLoading.set(false);
        // Load head-to-head data
        this.loadHead2Head(id);
      },

      error: () => {
        this.error.set('Failed to load match details');
        this.isLoading.set(false);
      }
    });
  }

  loadHead2Head(matchId: number): void {
    this.isLoadingH2H.set(true);
    this.service.getHead2Head(matchId, 10).subscribe({
      next: (res) => {
        console.log('Head2Head Response:', res);
        this.head2head.set(res);
        
        // Calculate statistics from matches
        if (res.matches && res.matches.length > 0) {
          const stats = this.calculateStats(res);
          this.calculatedStats.set(stats);
          console.log('Calculated Stats:', stats);
        }
        
        this.isLoadingH2H.set(false);
      },
      error: (err) => {
        console.error('Head2Head Error:', err);
        this.isLoadingH2H.set(false);
      }
    });
  }

  calculateStats(h2hData: Head2HeadResponse): { homeWins: number; awayWins: number; draws: number } {
    const homeTeamId = h2hData.aggregates.homeTeam.id;
    const awayTeamId = h2hData.aggregates.awayTeam.id;
    
    let homeWins = 0;
    let awayWins = 0;
    let draws = 0;

    h2hData.matches.forEach(match => {
      if (match.score.winner === 'DRAW') {
        draws++;
      } else if (match.score.winner === 'HOME_TEAM') {
        // Check which team was home in this historical match
        if (match.homeTeam.id === homeTeamId) {
          homeWins++;
        } else {
          awayWins++;
        }
      } else if (match.score.winner === 'AWAY_TEAM') {
        // Check which team was away in this historical match
        if (match.awayTeam.id === homeTeamId) {
          homeWins++;
        } else {
          awayWins++;
        }
      }
    });

    return { homeWins, awayWins, draws };
  }

  getWinPercentage(wins: number, total: number): number {
    return total > 0 ? Math.round((wins / total) * 100) : 0;
  }

  goBack() {
    this.location.back();
  }
}

import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CompetitionsService } from '../../services/competitions.service';
import { Player, PlayerMatchesResponse, PlayerMatch } from '../../models/player.model';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-detail.component.html',
  styleUrl: './player-detail.component.css'
})
export class PlayerDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private competitionsService = inject(CompetitionsService);

  player = signal<Player | null>(null);
  playerMatches = signal<PlayerMatchesResponse | null>(null);
  isLoadingPlayer = signal(true);
  isLoadingMatches = signal(false);
  error = signal<string | null>(null);
  personId = signal<number | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.personId.set(parseInt(id, 10));
      this.loadPlayer(parseInt(id, 10));
      this.loadPlayerMatches(parseInt(id, 10));
    } else {
      this.error.set('Invalid player ID');
      this.isLoadingPlayer.set(false);
    }
  }

  loadPlayer(personId: number): void {
    this.isLoadingPlayer.set(true);
    this.error.set(null);

    this.competitionsService.getPlayer(personId).subscribe({
      next: (response) => {
        this.player.set(response);
        this.isLoadingPlayer.set(false);
      },
      error: (err) => {
        console.error('Error loading player:', err);
        this.error.set('Failed to load player details. Please try again later.');
        this.isLoadingPlayer.set(false);
      }
    });
  }

  loadPlayerMatches(personId: number, limit: number = 20): void {
    this.isLoadingMatches.set(true);

    this.competitionsService.getPlayerMatches(personId, undefined, undefined, undefined, undefined, limit).subscribe({
      next: (response) => {
        this.playerMatches.set(response);
        this.isLoadingMatches.set(false);
      },
      error: (err) => {
        console.error('Error loading player matches:', err);
        // Don't show error as matches are secondary data
        this.isLoadingMatches.set(false);
      }
    });
  }

  getAge(dateOfBirth: string): number {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  formatDateTime(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  getSection(): string {
    const p = this.player();
    if (!p) return 'Unknown';
    return p.section === 'PLAYER' ? 'Player' : p.section === 'COACH' ? 'Coach' : p.section;
  }

  get matches(): PlayerMatch[] {
    return this.playerMatches()?.matches || [];
  }

  get totalMatches(): number {
    const pm = this.playerMatches();
    return pm?.resultSet?.count || pm?.matches?.length || 0;
  }

  goBack(): void {
    // Try to go back to previous page, or competitions if no history
    window.history.back();
  }

  navigateToTeam(teamId: number | undefined): void {
    if (teamId) {
      this.router.navigate(['/teams', teamId]);
    }
  }

  navigateToMatch(matchId: number): void {
    // Can be extended if you have a match detail page
    console.log('Navigate to match:', matchId);
  }
}
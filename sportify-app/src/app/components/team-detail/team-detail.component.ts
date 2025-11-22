import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CompetitionsService } from '../../services/competitions.service';
import { Team, SquadPlayer } from '../../models/team.model';

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-detail.component.html',
  styleUrl: './team-detail.component.css'
})
export class TeamDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private competitionsService = inject(CompetitionsService);
  
  team = signal<Team | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  teamId = signal<number | null>(null);
  selectedPosition = signal<string>('ALL');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.teamId.set(parseInt(id, 10));
      this.loadTeam(parseInt(id, 10));
    } else {
      this.error.set('Invalid team ID');
      this.isLoading.set(false);
    }
  }

  loadTeam(teamId: number): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.competitionsService.getTeam(teamId).subscribe({
      next: (response) => {
        this.team.set(response);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading team:', err);
        this.error.set('Failed to load team details. Please try again later.');
        this.isLoading.set(false);
      }
    });
  }

  getPositionCategory(position: string): string {
    const positionLower = position.toLowerCase();
    
    if (positionLower.includes('goalkeeper')) {
      return 'Goalkeepers';
    }
    
    if (positionLower.includes('back') || positionLower.includes('defence') || positionLower.includes('centre-back') || positionLower.includes('defender') || positionLower.includes('defensive')) {
      return 'Defenders';
    }
    
    if (positionLower.includes('midfield') || positionLower.includes('midfield')) {
      return 'Midfielders';
    }
    
    if (positionLower.includes('forward') || positionLower.includes('winger') || positionLower.includes('offence') || positionLower.includes('striker') || positionLower.includes('attacking')) {
      return 'Attackers';
    }
    
    // Default fallback
    return 'Midfielders';
  }

  get filteredSquad(): SquadPlayer[] {
    const teamData = this.team();
    if (!teamData || !teamData.squad) {
      return [];
    }
    
    if (this.selectedPosition() === 'ALL') {
      return teamData.squad;
    }
    
    return teamData.squad.filter(player => {
      return this.getPositionCategory(player.position) === this.selectedPosition();
    });
  }

  get positionFilters(): string[] {
    return ['ALL', 'Goalkeepers', 'Defenders', 'Midfielders', 'Attackers'];
  }

  onPositionFilterChange(position: string): void {
    this.selectedPosition.set(position);
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

  goBack(): void {
    // Try to go back to previous page, or competitions if no history
    this.router.navigate(['/competitions']);
  }

  navigateToCompetition(competitionId: number): void {
    this.router.navigate(['/competitions', competitionId]);
  }
}

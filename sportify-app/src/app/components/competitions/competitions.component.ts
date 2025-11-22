import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CompetitionsService } from '../../services/competitions.service';
import { Competition } from '../../models/competition.model';

@Component({
  selector: 'app-competitions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './competitions.component.html',
  styleUrl: './competitions.component.css'
})
export class CompetitionsComponent implements OnInit {
  private competitionsService = inject(CompetitionsService);
  private router = inject(Router);
  
  competitions = signal<Competition[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  searchQuery = signal('');
  selectedType = signal<'ALL' | 'LEAGUE' | 'CUP'>('ALL');

  ngOnInit(): void {
    this.loadCompetitions();
  }

  loadCompetitions(): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.competitionsService.getCompetitions().subscribe({
      next: (response) => {
        this.competitions.set(response.competitions);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading competitions:', err);
        this.error.set('Failed to load competitions. Please try again later.');
        this.isLoading.set(false);
      }
    });
  }

  get filteredCompetitions(): Competition[] {
    let filtered = this.competitions();

    // Filter by search query
    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(comp => 
        comp.name.toLowerCase().includes(query) ||
        comp.area.name.toLowerCase().includes(query)
      );
    }

    // Filter by type
    if (this.selectedType() !== 'ALL') {
      filtered = filtered.filter(comp => comp.type === this.selectedType());
    }

    return filtered;
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  onTypeFilterChange(type: 'ALL' | 'LEAGUE' | 'CUP'): void {
    this.selectedType.set(type);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  viewCompetition(competitionId: number): void {
    this.router.navigate(['/competitions', competitionId]);
  }
}
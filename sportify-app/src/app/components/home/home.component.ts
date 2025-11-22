import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private router = inject(Router);
  
  protected readonly title = signal('Sportify');
  
  protected readonly features = signal<Feature[]>([
    {
      icon: '📊',
      title: 'Competitions',
      description: 'Browse leagues and tournaments globally'
    },
    {
      icon: '📅',
      title: 'Fixtures',
      description: 'Never miss a match with upcoming schedules'
    },
    {
      icon: '🏆',
      title: 'Standings',
      description: 'Track team positions and statistics'
    }
  ]);

  exploreCompetitions(): void {
    this.router.navigate(['/competitions']);
  }
}

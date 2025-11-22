import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
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
    // TODO: Navigate to competitions page
    console.log('Explore competitions clicked');
  }
}

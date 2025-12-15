import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CompetitionsService } from '../../services/competitions.service';
import { Location } from '@angular/common';

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
  isLoading = signal(true);
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
      },

      error: () => {
        this.error.set('Failed to load match details');
        this.isLoading.set(false);
      }
    });
  }

  goBack() {
    this.location.back();
  }
}

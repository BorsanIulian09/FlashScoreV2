import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerDetail } from './player-detail';

describe('PlayerDetail', () => {
  let component: PlayerDetail;
  let fixture: ComponentFixture<PlayerDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

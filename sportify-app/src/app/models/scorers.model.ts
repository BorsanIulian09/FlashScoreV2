export interface ScorersFilters {
  season?: string;
  limit?: number;
}

export interface ScorersCompetition {
  id: number;
  name: string;
  code: string;
  type: string;
  emblem: string;
}

export interface ScorersSeason {
  id: number;
  startDate: string;
  endDate: string;
  currentMatchday: number;
  winner: any | null;
}

export interface ScorerPlayer {
  id: number;
  name: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string;
  nationality: string;
  section: string | null;
  position: string | null;
  shirtNumber: number | null;
  lastUpdated: string;
}

export interface ScorerTeam {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  address: string;
  website: string;
  founded: number;
  clubColors: string;
  venue: string;
  lastUpdated: string;
}

export interface Scorer {
  player: ScorerPlayer;
  team: ScorerTeam;
  playedMatches: number;
  goals: number;
  assists: number | null;
  penalties: number | null;
}

export interface ScorersResponse {
  count: number;
  filters: ScorersFilters;
  competition: ScorersCompetition;
  season: ScorersSeason;
  scorers: Scorer[];
}


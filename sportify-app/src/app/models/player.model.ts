export interface CoachContract {
  start: string;
  until: string;
}

export interface PlayerMatch {
  id: number;
  utcDate: string;
  status: string;
  matchday: number | null;
  stage: string | null;
  group: string | null;
  lastUpdated: string;
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  score: {
    winner: string | null;
    duration: string;
    fullTime: {
      home: number | null;
      away: number | null;
    };
    halfTime: {
      home: number | null;
      away: number | null;
    };
  };
}

export interface PlayerMatchesResponse {
  filters: {
    dateFrom?: string;
    dateTo?: string;
    status?: string;
    competitions?: string;
    limit?: string;
    offset?: string;
  };
  resultSet: {
    count: number;
    first: string;
    last: string;
    played: number;
  };
  person: {
    id: number;
    name: string;
    dateOfBirth: string;
    nationality: string;
    section: string;
    position: string;
    shirtNumber: number | null;
    lastUpdated: string;
  };
  matches: PlayerMatch[];
}

export interface PlayerStats {
  appearances: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
}

export interface Player {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  section: string; 
  position?: string;
  shirtNumber?: number | null;
  contract?: CoachContract;
  currentTeam?: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  lastUpdated: string;
}
export interface Area {
  id: number;
  name: string;
  code: string;
  flag: string | null;
}

export interface Winner {
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

export interface CurrentSeason {
  id: number;
  startDate: string;
  endDate: string;
  currentMatchday: number | null;
  winner: Winner | null;
}

export interface Competition {
  id: number;
  area: Area;
  name: string;
  code: string;
  type: 'LEAGUE' | 'CUP';
  emblem: string;
  plan: string;
  currentSeason: CurrentSeason;
  numberOfAvailableSeasons: number;
  lastUpdated: string;
}

export interface CompetitionsResponse {
  count: number;
  filters: {
    client: string;
  };
  competitions: Competition[];
}

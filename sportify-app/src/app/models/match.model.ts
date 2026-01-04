export interface Filters {
  matchday?: string;
  season?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  stage?: string;
  group?: string;
}

export interface ResultSet {
  count: number;
  first: string;
  last: string;
  played: number;
}

export interface MatchCompetition {
  id: number;
  name: string;
  code: string;
  type: string;
  emblem: string;
}

export interface MatchArea {
  id: number;
  name: string;
  code: string;
  flag: string;
}

export interface MatchSeason {
  id: number;
  startDate: string;
  endDate: string;
  currentMatchday: number;
  winner: any | null;
}

export interface MatchTeam {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface MatchScore {
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
}

export interface MatchReferee {
  id: number;
  name: string;
  type: string;
  nationality: string;
}

export interface Match {
  area: MatchArea;
  competition: MatchCompetition;
  season: MatchSeason;
  id: number;
  utcDate: string;
  status: string;
  matchday: number | null;
  stage: string | null;
  group: string | null;
  lastUpdated: string;
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
  score: MatchScore;
  odds: any;
  referees: MatchReferee[];
}

export interface MatchResponse {
  filters: Filters;
  resultSet: ResultSet;
  competition: MatchCompetition;
  matches: Match[];
}

export interface Head2HeadAggregates {
  numberOfMatches: number;
  totalGoals: number;
  homeTeam: {
    id: number;
    name: string;
    wins: number;
    draws: number;
    losses: number;
  };
  awayTeam: {
    id: number;
    name: string;
    wins: number;
    draws: number;
    losses: number;
  };
}

export interface Head2HeadResponse {
  aggregates: Head2HeadAggregates;
  matches: Match[];
}

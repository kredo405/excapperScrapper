import { Country } from "./matches";

export interface StatisticsResponse {
  statistics: {
    data: Statistics;
  };
}

export interface Statistics {
  topOutcomes: TopOutcomes;
  teams: {
    home: Team;
    away: Team;
  };
  matches: Matches;
  leagueTable: LeagueTable[];
  predictionStats: {};
  info: {};
}

export interface Team {
  logo: string;
  shortName: string;
  country: Country;
  slug: string;
}

export interface LeagueTable {
  position: number;
  team: Team;
  winTotal: number;
  lossTotal: number;
  drawTotal: number;
  goalsTotal: string;
  key: string;
}

export interface Matches {
  pastHome: LastMatch[];
  pastAway: LastMatch[];
  pastCros: LastMatch[];
}

export interface LastMatch {
  result: {
    ht: string;
    total: string;
  };
  sportSlug: string;
  teams: {
    home: Team;
    away: Team;
  };
}

export interface TopOutcomes {
  outcomes: Outcome[];
}

export interface Outcome {
  count: number;
  outcome: string;
  percent: number;
  rate: number;
  type: string;
}

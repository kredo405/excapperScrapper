import { Odds } from "./odds";

export interface MatchesResponse {
  matches: {
    data: League[];
  };
}

export interface LastMatchesResponse {
  lastMatches: {
    data: Match[];
  };
}

export interface League {
  logo: string;
  name: string;
  country: Country;
  matches: Match[];
}

export interface Statistics {
  xg: number | undefined;
}

export interface Match {
  odds?: Odds;
  id: string;
  slug: string;
  sportSlug: string;
  predictionStats: {
    haveExpertPredictions: boolean;
    total: number;
  };
  result: {
    ht: string;
    total: string;
  };
  teams: {
    home: {
      logo: string;
      name: string;
      shortName: string;
      statistic: Statistics;
    };
    away: {
      logo: string;
      name: string;
      shortName: string;
      statistic: Statistics;
    };
  };
}

export interface Country {
  logo: string;
  name: string;
}

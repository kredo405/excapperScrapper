export interface MatchesResponse {
  matches: {
    data: League[];
  };
}

export interface League {
  logo: string;
  name: string;
  country: Country;
  matches: Match[];
}

export interface Match {
  id: string;
  slug: string;
  sportSlug: string;
  predictionStats: {
    haveExpertPredictions: boolean;
    total: number;
  };
  teams: {
    home: {
      logo: string;
      name: string;
    };
    away: {
      logo: string;
      name: string;
    };
  };
  odds: {
    one_x_two: {
      w1: { value: string };
      x?: { value: string };
      w2: { value: string };
    };
  };
}

export interface Country {
  logo: string;
  name: string;
}

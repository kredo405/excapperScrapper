export interface OddsResponse {
  odds: {
    data: {
      odds: Odds;
    };
  };
}

export interface OddsItem {
  type: string;
  outcome: string;
  bookmakerCode: string;
  value: number;
}

export interface Odds {
  [bet: string]: { [outcome: string]: OddsItem };
}

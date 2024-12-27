export interface PopularBetsResponse {
  popularBets: {
    data: PopularBets[];
    mtta: {
      total: string;
    };
  };
}

export interface PopularBets {
  type: string;
  outcome: string;
  count: number;
  isUserBet: boolean;
  rate: number;
  percent: number;
  result: string | null;
}

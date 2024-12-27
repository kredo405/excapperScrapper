export interface AvrrageStatisticsResponse {
  averageStatistics: {
    data: AvrrageStatistics;
  };
}

export interface AvrrageStatistics {
  home: Period;
  away: Period;
}

export interface Period {
  all: MatchStatistics;
  first: MatchStatistics;
  second: MatchStatistics;
}

export interface MatchStatistics {
  goals: StatisticCategory;
  corners: StatisticCategory;
  fouls: StatisticCategory;
  offsides: StatisticCategory;
  throwins: StatisticCategory;
  yellowcards: StatisticCategory;
  shots: StatisticCategory;
  shotstarget: StatisticCategory;
}

export interface StatisticCategory {
  total: string;
  individualTotal: string;
  individualTotalOpponent: string;
}

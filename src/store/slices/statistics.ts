import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Statistics,
  LastMatch,
  Matches,
  LeagueTable,
  Team,
  TopOutcomes,
} from "../../types/statistics";
import {
  AvrrageStatistics,
  Period,
  // MatchStatistics,
  StatisticCategory,
} from "../../types/aveageStatistics";

interface InitialState {
  statistics: Statistics;
  averageStatistics: AvrrageStatistics;
}

const createEmptyStatistic = (): StatisticCategory => ({
  total: "",
  individualTotal: "",
  individualTotalOpponent: "",
});

const createEmptyTeam = (): Team => ({
  logo: "",
  shortName: "",
  country: { logo: "", name: "" },
  slug: "",
});

const createEmptyLastMatch = (): LastMatch => ({
  result: { ht: "", total: "" },
  teams: { home: createEmptyTeam(), away: createEmptyTeam() },
  sportSlug: "",
});

const createEmptyAverageStats = (): Period => ({
  all: {
    goals: createEmptyStatistic(),
    corners: createEmptyStatistic(),
    fouls: createEmptyStatistic(),
    offsides: createEmptyStatistic(),
    throwins: createEmptyStatistic(),
    yellowcards: createEmptyStatistic(),
    shots: createEmptyStatistic(),
    shotstarget: createEmptyStatistic(),
  },
  first: {
    goals: createEmptyStatistic(),
    corners: createEmptyStatistic(),
    fouls: createEmptyStatistic(),
    offsides: createEmptyStatistic(),
    throwins: createEmptyStatistic(),
    yellowcards: createEmptyStatistic(),
    shots: createEmptyStatistic(),
    shotstarget: createEmptyStatistic(),
  },
  second: {
    goals: createEmptyStatistic(),
    corners: createEmptyStatistic(),
    fouls: createEmptyStatistic(),
    offsides: createEmptyStatistic(),
    throwins: createEmptyStatistic(),
    yellowcards: createEmptyStatistic(),
    shots: createEmptyStatistic(),
    shotstarget: createEmptyStatistic(),
  },
});

const initialState: InitialState = {
  statistics: {
    topOutcomes: {
      outcomes: [{ outcome: "", count: 0, percent: 0, rate: 0, type: "" }],
    },
    teams: { home: createEmptyTeam(), away: createEmptyTeam() },
    matches: {
      pastHome: [createEmptyLastMatch()],
      pastAway: [createEmptyLastMatch()],
      pastCros: [createEmptyLastMatch()],
    },
    leagueTable: [
      {
        position: 1,
        team: createEmptyTeam(),
        winTotal: 20,
        lossTotal: 5,
        drawTotal: 3,
        goalsTotal: "50:20",
        key: "1",
      },
    ],
    predictionStats: {},
    info: {},
  },
  averageStatistics: {
    home: createEmptyAverageStats(),
    away: createEmptyAverageStats(),
  },
};

const statisticsSlice = createSlice({
  name: "statistics",
  initialState,
  reducers: {
    setLeagueTable: (state, action: PayloadAction<LeagueTable[]>) => {
      state.statistics.leagueTable = action.payload;
    },
    setMatches: (state, action: PayloadAction<Matches>) => {
      state.statistics.matches = action.payload;
    },
    setOutcomes: (state, action: PayloadAction<TopOutcomes>) => {
      state.statistics.topOutcomes = action.payload;
    },

    setTeams: (state, action: PayloadAction<{ home: Team; away: Team }>) => {
      state.statistics.teams = action.payload;
    },
    setAverageStatistics: (state, action: PayloadAction<AvrrageStatistics>) => {
      state.averageStatistics = action.payload;
    },
  },
});

export const {
  setLeagueTable,
  setMatches,
  setOutcomes,
  setTeams,
  setAverageStatistics,
} = statisticsSlice.actions;

export default statisticsSlice.reducer;

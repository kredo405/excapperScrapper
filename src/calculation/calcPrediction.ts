// import { scoresMatch } from "../data/scoresFootball";
import { calcAvgGoals } from "./calcAvgGoals";
// import { oddsFootball } from "../data/betsFootball";
import { monteCarloScoreSimulation } from "./calcMoncarlo";
// import { Matches } from "../types/statistics";
import { Match } from "../types/matches";
import { Team } from "../types/statistics";
// import { Predict } from "../types/predictions";
// import { AvrrageStatistics } from "../types/aveageStatistics";
// import { Predictors } from "../types/predictors";
import { calcLimit } from "./calcPredictionsCollective";
// import { isScoreMatchingPrediction } from "./isScoreMatchingPrediction";
// import { Bets } from "./calcMoncarlo";

// interface Outcome {
//   name: string;
//   odd: number;
//   scores: string[];
// }

export function calcPrediction(
  matchesHome: Match[] | undefined,
  matchesAway: Match[] | undefined,
  teams: { home: Team; away: Team }
  // predictions: Predict[] | undefined,
  // predictors: Predictors[] | undefined
) {
  const homeTeamName = teams.home.shortName;
  const awayTeamName = teams.away.shortName;

  const sportSlug = matchesHome?.[0]?.sportSlug || "";

  const limit = calcLimit(sportSlug);

  const avgGoalsHome = calcAvgGoals(
    matchesHome,
    homeTeamName,
    limit,
    sportSlug
  );
  const avgGoalsAway = calcAvgGoals(
    matchesAway,
    awayTeamName,
    limit,
    sportSlug
  );

  const individualTotalHome =
    (avgGoalsHome.avgGoalsFor + avgGoalsAway.avgGoalsAgainst) / 2;
  const individualTotalAway =
    (avgGoalsAway.avgGoalsFor + avgGoalsHome.avgGoalsAgainst) / 2;

  const probabilities = monteCarloScoreSimulation(
    individualTotalHome,
    individualTotalAway,
    limit,
    limit,
    100000
  );

  console.log(probabilities);
}

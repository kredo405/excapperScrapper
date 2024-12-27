import { AvrrageStatistics } from "../types/aveageStatistics";
import { Predictors } from "../types/predictors";
import { Predict } from "../types/predictions";
import { Outcome } from "../types/statistics";
import { Matches } from "../types/statistics";
import { Team } from "../types/statistics";
import { calcAvgGoals } from "./calcAvgGoals";
import { monteCarloScoreSimulation } from "./calcMoncarlo";
import { calcQuantityScoresWithPredictions } from "./calcQuantityScoresWithPredictions";
import { getFinalPrediction } from "./getFinalPrediction";
import { Odds } from "../types/odds";

function calcLimit(sportSlug: string) {
  if (sportSlug === "ice-Hockey") {
    return 10;
  } else if (sportSlug === "soccer") {
    return 5;
  } else if (sportSlug === "basketball") {
    return 140;
  }
}

export const calcPredictionsCollective = (
  matches: Matches,
  teams: { home: Team; away: Team },
  predictors: Predictors[] | undefined,
  predictions: Predict[] | undefined,
  odds: Odds | undefined
) => {
  // const data: Outcome[] = [];
  console.log(matches);

  const sportSlug = matches.pastHome[0].sportSlug;

  console.log(sportSlug);

  const homeTeamName = teams.home.shortName;
  const awayTeamName = teams.away.shortName;

  const limit = calcLimit(sportSlug);

  console.log(matches.pastHome, matches.pastAway);

  const avgGoalsHome = calcAvgGoals(
    matches.pastHome,
    homeTeamName,
    limit,
    sportSlug
  );
  const avgGoalsAway = calcAvgGoals(
    matches.pastAway,
    awayTeamName,
    limit,
    sportSlug
  );

  console.log(avgGoalsHome);
  console.log(avgGoalsAway);

  const individualTotalHome =
    (avgGoalsHome.avgGoalsFor + avgGoalsAway.avgGoalsAgainst) / 2;
  const individualTotalAway =
    (avgGoalsAway.avgGoalsFor + avgGoalsHome.avgGoalsAgainst) / 2;

  const probabilitiesMain = monteCarloScoreSimulation(
    individualTotalHome,
    individualTotalAway,
    limit,
    limit,
    100000
  );

  const scoresProbabilites = calcQuantityScoresWithPredictions(
    predictions,
    predictors,
    probabilitiesMain
  );

  console.log(scoresProbabilites);

  const result = getFinalPrediction(scoresProbabilites, odds);

  return result;
};

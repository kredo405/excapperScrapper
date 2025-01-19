import { Predictors } from "../types/predictors";
import { Predict } from "../types/predictions";
import { Team } from "../types/statistics";
import { calcAvgGoals } from "./calcAvgGoals";
import { monteCarloScoreSimulation } from "./calcMoncarlo";
import { calcQuantityScoresWithPredictions } from "./calcQuantityScoresWithPredictions";
import { getFinalPrediction } from "./getFinalPrediction";
import { Match } from "../types/matches";
import { Odds } from "../types/odds";

export function calcLimit(sportSlug: string) {
  if (sportSlug === "ice-Hockey") {
    return 7;
  } else if (sportSlug === "soccer") {
    return 4;
  } else if (sportSlug === "basketball") {
    return 130;
  }
}

export const calcPredictionsCollective = (
  matchesHome: Match[] | undefined,
  matchesAway: Match[] | undefined,
  teams: { home: Team; away: Team },
  predictors: Predictors[] | undefined,
  predictions: Predict[] | undefined,
  odds: Odds | undefined,
  value: number
) => {
  const sportSlug = matchesHome ? matchesHome[0].sportSlug : "";

  const homeTeamName = teams.home.shortName;
  const awayTeamName = teams.away.shortName;

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

  const probabilitiesMain = monteCarloScoreSimulation(
    individualTotalHome,
    individualTotalAway,
    limit,
    limit,
    100000
  );

  const newPredictions = predictions?.map((el) => {
    const desiredPredictor = predictors?.find(
      (item) => item.id === el.predictor.predictorId
    );

    if (desiredPredictor) {
      return {
        ...el,
        predictorInfo: desiredPredictor,
      };
    }
  });

  const newPredictionsFiltered = newPredictions
    ?.filter(
      (el) =>
        el !== null && el !== undefined && el.predictorInfo.result >= 50000
    )
    .sort((a, b) =>
      b?.predictorInfo && a?.predictorInfo
        ? b?.predictorInfo.result - a?.predictorInfo.result
        : 1
    );

  const predictionsWitchCategory: { [key: string]: any[] } = {};

  newPredictionsFiltered?.forEach((el) => {
    const outcomeKey = el?.type ? el.type : "";

    if (predictionsWitchCategory.hasOwnProperty(outcomeKey)) {
      predictionsWitchCategory[outcomeKey].push(el);
    } else {
      predictionsWitchCategory[outcomeKey] = [el];
    }
  });

  const scoresProbabilites = calcQuantityScoresWithPredictions(
    predictions,
    predictors,
    probabilitiesMain
  );

  console.log(probabilitiesMain);

  const result = getFinalPrediction(scoresProbabilites, odds, sportSlug, value);

  console.log(result);

  return result;
};

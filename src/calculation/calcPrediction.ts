import { Predictors } from "../types/predictors";
import { Predict } from "../types/predictions";
import { formatBets } from "./formatBets";
// import { Team } from "../types/statistics";
// import { calcAvgGoals } from "./calcAvgGoals";
// import { monteCarloScoreSimulation } from "./calcMoncarlo";
// import { calcQuantityScoresWithPredictions } from "./calcQuantityScoresWithPredictions";
// // import { getFinalPrediction } from "./getFinalPrediction";
// import { Match } from "../types/matches";
// import { Odds } from "../types/odds";
// import { count } from "firebase/firestore";

function normalizeROI(roi: number): number {
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

  // Базовое влияние зависит от того, отрицательный ROI или положительный
  const baseInfluence = roi >= 0 ? 0.15 : 0.2;

  // Чем больше ROI, тем меньше делитель, чтобы сгладить экстремумы
  const scalingFactor = 10; // Можно настроить для большего сглаживания

  // Нормализация ROI через сглаживающую сигмоиду
  return sigmoid(roi / scalingFactor) * (1 - baseInfluence) + baseInfluence;
}

const normalizeProfit = (value: number): number => {
  const min = -300000;
  const max = 300000;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
};

export const calcPrediction = (
  // matchesHome: Match[] | undefined,
  // matchesAway: Match[] | undefined,
  // teams: { home: Team; away: Team },
  predictors: Predictors[] | undefined,
  predictions: Predict[] | undefined
  // odds: Odds | undefined,
  // value: number
) => {
  // const sportSlug = matchesHome ? matchesHome[0].sportSlug : "";

  // const homeTeamName = teams.home.shortName;
  // const awayTeamName = teams.away.shortName;

  interface PredictionsInfo {
    predictor: Predictors | undefined;
    type: string;
    outcome: string;
    comment: string;
    rate: number;
  }

  const resultPredictions: {
    [key: string]: {
      outcome: string;
      type: string;
      influenceFactor: number;
      count: number;
      odd: number;
      name: { name: string; shortName: string } | undefined;
      prediction: PredictionsInfo[] | undefined;
    };
  } = {};

  predictions?.forEach((prediction) => {
    const { type, outcome, predictor, rate } = prediction;

    const desiredPredictor = predictors?.find(
      (item) => item.id === predictor.predictorId
    );

    if (!desiredPredictor) return;

    const { roi = 0, result: profit = 0, won = 0, lose = 0 } = desiredPredictor;

    // Нормализация данных прогнозиста
    const normalizedROI = normalizeROI(roi);
    const normalizedProfit = normalizeProfit(profit);
    const normalizedWinRate = won + lose > 0 ? won / (won + lose) : 0; // Процент выигранных ставок

    // Общий коэффициент влияния
    const influenceFactor =
      2 * normalizedROI + 3 * normalizedProfit + 2.5 * normalizedWinRate;

    const key = `${type}_${outcome}`;

    if (resultPredictions[key]) {
      resultPredictions[key].influenceFactor += influenceFactor;
      resultPredictions[key].count += 1;
    } else {
      resultPredictions[key] = {
        outcome,
        type,
        influenceFactor,
        count: 1,
        odd: rate,
        name: formatBets(prediction),
        prediction: predictions
          ?.filter((el) => el.type === type && el.outcome === outcome)
          .map((predict) => {
            const predictor = predictors?.find(
              (predictor) => predictor.id === predict.predictor.predictorId
            );

            return { ...predict, predictor };
          })
          .sort((a, b) =>
            a.predictor && b.predictor
              ? b.predictor?.result - a.predictor?.result
              : 0
          )
          .filter((el) => (el.predictor ? el.predictor?.result > 0 : false))
          .slice(0, 5),
      };
    }
  });

  const arrayPredictionsWithFactors = Object.entries(resultPredictions)
    .filter(([_, value]) => value.influenceFactor > 0)
    .sort((a, b) => b[1].influenceFactor - a[1].influenceFactor)
    .map(([_, value]) => ({ ...value }))
    .map((el) => {
      // if (el.count > 0) {
      //   el.influenceFactor = el.influenceFactor / el.count;
      //   return el;
      // } else {
      //   return el;
      // }

      return el;
    })
    .sort((a, b) => b.influenceFactor - a.influenceFactor)
    .filter((el) => el.count > 3 && el.odd > 1.65 && el.name)
    .slice(0, 20);

  const weightQuality = 0.7; // Вес для influenceFactor
  const weightQuantity = 0.3; // Вес для count

  const dataWithCombinedValue = arrayPredictionsWithFactors
    .map((item) => ({
      ...item,
      combinedValue:
        item.influenceFactor * weightQuality + item.count * weightQuantity, // Взвешенная сумма
    }))
    .sort((a, b) => b.combinedValue - a.combinedValue);

  console.log(dataWithCombinedValue);
  return dataWithCombinedValue;
};

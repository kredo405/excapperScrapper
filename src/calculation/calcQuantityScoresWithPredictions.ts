import { Predict } from "../types/predictions";
import { Predictors } from "../types/predictors";
import { Bets } from "./calcMoncarlo";
import { isScoreMatchingPrediction } from "./isScoreMatchingPrediction";

export const calcQuantityScoresWithPredictions = (
  predictions: Predict[] | undefined,
  predictors: Predictors[] | undefined,
  probabilities: {
    [score: string]: { probability: number; quantity: number; bets: Bets[] };
  }
) => {
  const newProbabilities = Object.fromEntries(
    Object.entries(probabilities).map(([score, data]) => [
      score,
      { ...data, bets: data.bets.map((bet) => ({ ...bet })) },
    ])
  );

  // Нормализация значений

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

  const normalizeRank = (rank: number): number => {
    const min = 1; // Самый высокий ранг
    const max = 5000; // Самый низкий ранг
    return Math.max(0, Math.min(1, (max - rank) / (max - min)));
  };

  const predictorsFiltered = predictors?.filter((el) => el.roi > -5);

  predictions?.forEach((prediction) => {
    const { type, outcome, predictor } = prediction;

    const desiredPredictor = predictorsFiltered?.find(
      (item) => item.id === predictor.predictorId
    );

    if (!desiredPredictor) return;

    const {
      roi = 0,
      result = 0,
      won = 0,
      lose = 0,
      position = 0,
    } = desiredPredictor;

    // Нормализация данных прогнозиста
    const normalizedROI = normalizeROI(roi);
    const normalizedProfit = normalizeProfit(result);
    const normalizedWinRate = won + lose > 0 ? won / (won + lose) : 0; // Процент выигранных ставок
    const normalizedRank = normalizeRank(position);

    // Общий коэффициент влияния
    const influenceFactor =
      0.6 * normalizedROI +
      0.4 * normalizedProfit +
      0.7 * normalizedWinRate +
      0.4 * (1 - normalizedRank); // Чем ниже ранг, тем выше влияние

    for (const score in newProbabilities) {
      const { probability } = newProbabilities[score];
      const [homeGoals, awayGoals] = score.split(":").map(Number);

      if (isScoreMatchingPrediction(type, outcome, homeGoals, awayGoals)) {
        const adjustedProbability = probability * influenceFactor;

        newProbabilities[score].quantity += adjustedProbability;

        let betExists = false;
        for (const bet of newProbabilities[score].bets) {
          if (bet.type === type && bet.outcome === outcome) {
            bet.count = (bet.count || 1) + 1;
            betExists = true;
            break;
          }
        }
        if (!betExists) {
          newProbabilities[score].bets.push({ type, outcome, count: 1 });
        }
      }
    }
  });

  return newProbabilities;
};

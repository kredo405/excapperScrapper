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
  // Нормализуем ROI
  function normalizeROI(roi: number): number {
    const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
    const baseInfluence = 0.1; // Минимальное влияние (например, 10%)
    return sigmoid(roi / 2) * (1 - baseInfluence) + baseInfluence;
  }

  const newProbabilities: {
    [score: string]: { probability: number; quantity: number; bets: Bets[] };
  } = JSON.parse(JSON.stringify(probabilities)); // Создаем копию
  // Перебираем массив прогнозов
  predictions?.forEach((prediction) => {
    const { type, outcome, predictor } = prediction;
    const desiredPredictor = predictors?.find(
      (item) => item.id === predictor.predictorId
    );

    const roi = desiredPredictor?.roi ?? 0;
    const roiFactor = normalizeROI(roi); // Преобразованный ROI

    // Перебираем все счета из Probabilities
    for (const score in newProbabilities) {
      const { probability } = newProbabilities[score]; // Берем probability из Probabilities
      const [homeGoals, awayGoals] = score.split(":").map(Number);

      // Проверяем, подходит ли счет под прогноз
      if (isScoreMatchingPrediction(type, outcome, homeGoals, awayGoals)) {
        const adjustedProbability = probability * roiFactor; // Корректируем probability

        // Обновляем quantity с учетом скорректированного probability
        newProbabilities[score].quantity += adjustedProbability;

        // Добавляем в bets информацию о прогнозе
        let betExists = false;
        for (const bet of newProbabilities[score].bets) {
          if (bet.type === type && bet.outcome === outcome) {
            bet.count = (bet.count || 1) + 1;
            bet.roi = (bet.roi || 0) + roi;
            betExists = true;
            break;
          }
        }
        if (!betExists) {
          newProbabilities[score].bets.push({ type, outcome, count: 1, roi });
        }
      }
    }
  });

  return newProbabilities;
};

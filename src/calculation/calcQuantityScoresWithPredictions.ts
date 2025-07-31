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
      {
        ...data,
        bets: JSON.parse(JSON.stringify(data.bets)), // Глубокое копирование
      },
    ])
  );

  const arrProbabilities = Object.entries(newProbabilities).map(
    ([score, data]) => ({
      score, // Добавляем счёт как отдельное поле
      ...data, // Копируем остальные свойства
      bets: JSON.parse(JSON.stringify(data.bets)), // Глубокое копирование bets
    })
  );

  console.log(arrProbabilities);

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

  predictions?.forEach((prediction) => {
    const { type, outcome, predictor } = prediction;

    const desiredPredictor = predictors?.find(
      (item) => item.id === predictor.predictorId
    );

    if (!desiredPredictor) return;

    const { roi = 0, result = 0, won = 0, lose = 0 } = desiredPredictor;

    // Нормализация данных прогнозиста
    const normalizedROI = normalizeROI(roi);
    const normalizedProfit = normalizeProfit(result);
    const normalizedWinRate = won + lose > 0 ? won / (won + lose) : 0; // Процент выигранных ставок

    // Общий коэффициент влияния
    const influenceFactor =
      3 * normalizedROI + 6 * normalizedProfit + 4 * normalizedWinRate;

    arrProbabilities.forEach((el) => {
      const probability = el.probability;
      const [homeGoals, awayGoals] = el.score.split(":").map(Number);

      const adjustedProbability = probability * influenceFactor;

      if (isScoreMatchingPrediction(type, outcome, homeGoals, awayGoals)) {
        el.quantity += adjustedProbability;
      }
    });
  });

  const probabilitiesObject = Object.fromEntries(
    arrProbabilities.map((item) => [
      item.score, // Ключ (счёт)
      {
        probability: item.probability,
        quantity: item.quantity,
        bets: JSON.parse(JSON.stringify(item.bets)), // Глубокая копия
      },
    ])
  );

  console.log(probabilitiesObject);
  return probabilitiesObject;
};

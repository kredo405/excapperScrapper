import { Bets } from "./calcMoncarlo";
import { Odds } from "../types/odds";
import { formatBets } from "./formatBets";
import { isScoreMatchingPrediction } from "./isScoreMatchingPrediction";
import { Predictors } from "../types/predictors";

interface Probabilites {
  [score: string]: {
    probability: number;
    quantity: number;
    bets: Bets[];
  };
}

export interface PredictionsInfo {
  predictor: Predictors | undefined;
  type: string;
  outcome: string;
  comment: string;
  rate: number;
}

interface InputObject {
  [key: string]: any;
}

interface ResultObject {
  type: string;
  outcome: string;
  value: number;
}

export interface Bet {
  type: string;
  outcome: string;
  value: number;
  percent?: number;
  predictions?: PredictionsInfo[];
  betProbability?: number;
  weight?: number;
  name?: {
    name: string;
    shortName: string;
  };
}

interface Score {
  score: string;
  probability: number;
  quantity: number;
  percentage: number;
}

function calculateBetMatchPercentage(
  bets: ResultObject[],
  scores: Score[],
  // predictions: Predict[] | undefined,
  // predictors: Predictors[] | undefined,
  sportSlug: string
): Bet[] {
  return bets.map((bet) => {
    let weightedMatchingScores = 0;
    let totalWeight = 0;

    let scoresArray;

    if (sportSlug === "soccer") {
      scoresArray = scores
        .slice(0, 10)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 6);
    } else if (sportSlug === "ice-hockey") {
      scoresArray = scores
        .slice(0, 13)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 9);
    } else {
      scoresArray = scores
        .slice(0, 1000)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 500);
    }

    let prob = 0;

    // Проверяем совпадение каждого score с bet и учитываем вес ( probability)
    for (const score of scoresArray) {
      const [homeGoals, awayGoals] = score.score.split(":").map(Number);
      const weight = score.probability; // Учитываем  вероятность

      if (
        isScoreMatchingPrediction(bet.type, bet.outcome, homeGoals, awayGoals)
      ) {
        weightedMatchingScores += weight; // Учитываем совпадение с весом
        prob += score.percentage;
      }

      totalWeight += weight; // Суммируем общий вес
    }

    // Вычисляем взвешенный процент
    const percent =
      totalWeight > 0 ? (weightedMatchingScores / totalWeight) * 100 : 0;

    // Округляем процент и добавляем имя
    return {
      ...bet,
      percent: Math.round(percent),
      name: formatBets(bet),
      weight: prob,
    };
  });
}

function convertObjectToArray(data: InputObject | undefined): ResultObject[] {
  const result: ResultObject[] = [];

  // Рекурсивная функция для обработки каждого уровня объекта
  function processObject(obj: InputObject | undefined): void {
    for (const key in obj) {
      const value = obj[key];
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        if (value.type && value.outcome && value.value) {
          result.push({
            type: value.type,
            outcome: value.outcome,
            value: value.value,
          });
        } else {
          processObject(value);
        }
      }
    }
  }

  processObject(data);

  return result;
}

export const getFinalPrediction = (
  data: Probabilites,
  odds: Odds | undefined,
  sportSlug: string,
  value: number
  // predictions: Predict[] | undefined,
  // predictors: Predictors[] | undefined
) => {
  // 1. Преобразование объекта в массив объектов для сортировки
  const resultsArray = Object.entries(data).map(([score, values]) => ({
    score,
    ...values,
  }));

  const arrayOdds = convertObjectToArray(odds);

  const totalQuantity = resultsArray.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Шаг 2: Рассчитываем процент для каждого счета
  const dataWithPercentage = resultsArray
    .map((item) => ({
      ...item,
      percentage: (item.quantity / totalQuantity) * 100,
      res: ((item.quantity / totalQuantity) * 100 + item.probability) / 2,
    }))
    .sort((a, b) => b.probability - a.probability);

  const result = calculateBetMatchPercentage(
    arrayOdds,
    dataWithPercentage.slice(0, 10),
    // predictions,
    // predictors,
    sportSlug
  )
    .filter((el) => (el.value >= value && el.percent ? el.percent > 20 : false))
    .sort((a, b) => (a.percent && b.percent ? b.percent - a.percent : 0))
    .slice(0, 20);

  console.log(result);

  function removeDuplicatesByType(arr: Bet[]) {
    const seenTypes = new Map();
    const result = [];

    for (const item of arr) {
      if (!seenTypes.has(item.type)) {
        seenTypes.set(item.type, true);
        result.push(item);
      }
    }

    return result;
  }

  const uniqueData = removeDuplicatesByType(result);

  return {
    bets: uniqueData.slice(0, 4),
    // scores: resultsArray,
  };
};

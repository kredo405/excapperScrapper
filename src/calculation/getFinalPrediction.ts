import { Bets } from "./calcMoncarlo";
import { Odds } from "../types/odds";
import { formatBets } from "./formatBets";
import { isScoreMatchingPrediction } from "./isScoreMatchingPrediction";
import { Predict } from "../types/predictions";
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
}

function calculateBetMatchPercentage(
  bets: ResultObject[],
  scores: Score[],
  predictions: Predict[] | undefined,
  predictors: Predictors[] | undefined,
  sportSlug: string
): Bet[] {
  return bets.map((bet) => {
    let weightedMatchingScores = 0;
    let totalWeight = 0;
    let countMatchingScores = 0;
    let total = 0;
    let sumWeight = 0;

    let scoresArray;

    if (sportSlug === "soccer") {
      scoresArray = scores.slice(0, 5);
    } else if (sportSlug === "ice-hockey") {
      scoresArray = scores.slice(0, 10);
    } else {
      scoresArray = scores.slice(0, 500);
    }

    for (const score of scores) {
      const [homeGoals, awayGoals] = score.score.split(":").map(Number);

      if (
        isScoreMatchingPrediction(bet.type, bet.outcome, homeGoals, awayGoals)
      ) {
        countMatchingScores += score.probability; // Учитываем совпадение с весом
        sumWeight += score.quantity;
      }

      total += score.probability; // Суммируем общий вес
    }

    const betProbability = total > 0 ? (countMatchingScores / total) * 100 : 0;

    const predictionsWithBet = predictions?.filter((p) => p.type === bet.type);
    const predictionsInfo = predictionsWithBet
      ?.map((el) => {
        const predictor = predictors?.find(
          (predictor) => predictor.id === el.predictor.predictorId
        );
        return {
          ...el,
          predictor,
        };
      })
      .filter((el) => (el.predictor ? el.predictor?.roi : -11 > -10))
      .sort((a, b) =>
        b.predictor && a.predictor ? b.predictor?.roi - a.predictor?.roi : 0
      )
      .slice(0, 5);

    // Проверяем совпадение каждого score с bet и учитываем вес ( probability)
    for (const score of scoresArray) {
      const [homeGoals, awayGoals] = score.score.split(":").map(Number);
      const weight = score.probability; // Учитываем  вероятность

      if (
        isScoreMatchingPrediction(bet.type, bet.outcome, homeGoals, awayGoals)
      ) {
        weightedMatchingScores += weight; // Учитываем совпадение с весом
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
      predictions: predictionsInfo,
      betProbability,
      weight: sumWeight,
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
  value: number,
  predictions: Predict[] | undefined,
  predictors: Predictors[] | undefined
) => {
  // 1. Преобразование объекта в массив объектов для сортировки
  const resultsArray = Object.entries(data).map(([score, values]) => ({
    score,
    ...values,
  }));

  // 2. Сортировка массива по quantity (убыванию)
  resultsArray.sort((a, b) => b.quantity - a.quantity);

  const arrayOdds = convertObjectToArray(odds);

  const result = calculateBetMatchPercentage(
    arrayOdds,
    resultsArray,
    predictions,
    predictors,
    sportSlug
  )
    .filter((el) => (el.value >= value && el.percent ? el.percent > 20 : false))
    .sort((a, b) => (a.percent && b.percent ? b.percent - a.percent : 0))
    .slice(0, 20);

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
    bets: uniqueData.slice(0, 5),
    // scores: resultsArray,
  };
};

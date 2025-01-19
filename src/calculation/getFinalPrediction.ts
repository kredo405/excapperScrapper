import { Bets } from "./calcMoncarlo";
import { Odds } from "../types/odds";
import { formatBets } from "./formatBets";
import { isScoreMatchingPrediction } from "./isScoreMatchingPrediction";

interface Probabilites {
  [score: string]: {
    probability: number;
    quantity: number;
    bets: Bets[];
  };
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
  name?: {
    name: string;
    shortName: string;
  };
}

interface Score {
  score: string;
  probability: number;
  quantity: number;
  weight: number;
}

function calculateBetMatchPercentage(bets: Bet[], scores: Score[]): Bet[] {
  return bets.map((bet) => {
    let weightedMatchingScores = 0;
    let totalWeight = 0;

    // Проверяем совпадение каждого score с bet и учитываем вес (quantity и probability)
    for (const score of scores) {
      const [homeGoals, awayGoals] = score.score.split(":").map(Number);
      const weight = score.weight;

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
    return { ...bet, percent: Math.round(percent), name: formatBets(bet) };
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
) => {
  // 1. Преобразование объекта в массив объектов для сортировки
  const resultsArray = Object.entries(data).map(([score, values]) => ({
    score,
    ...values,
  }));

  // 2. Сортировка массива по quantity (убыванию)
  resultsArray.sort((a, b) => b.quantity - a.quantity);

  const arrayOdds = convertObjectToArray(odds);

  const scoresNewProbabilities = resultsArray
    .map((el) => {
      return {
        ...el,
        weight: el.quantity * el.probability,
      };
    })
    .sort((a, b) => b.weight - a.weight);

  console.log(scoresNewProbabilities);

  let scoresArray;

  if (sportSlug === "soccer") {
    scoresArray = scoresNewProbabilities.slice(0, 7);
  } else if (sportSlug === "ice-hockey") {
    scoresArray = scoresNewProbabilities.slice(0, 15);
  } else {
    scoresArray = scoresNewProbabilities.slice(0, 500);
  }

  const result = calculateBetMatchPercentage(arrayOdds, scoresArray)
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
    bets: uniqueData.slice(0, 2),
    scores: resultsArray,
  };
};

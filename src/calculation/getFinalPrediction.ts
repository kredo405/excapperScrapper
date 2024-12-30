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
}

function calculateBetMatchPercentage(
  bets: Bet[],
  scores: Score[],
  sportSlug: string
): Bet[] {
  return bets.map((bet) => {
    let weightedMatchingScores = 0;
    let totalWeight = 0;

    // Получаем первые три элемента без изменения исходного массива
    const firstThreeScores = scores.slice(0, 3);

    // Фильтруем оставшиеся элементы
    // Сортируем оставшиеся элементы по убыванию probability и берем первые 4

    let countFirstScores;

    if (sportSlug === "soccer") {
      countFirstScores = 4;
    } else if (sportSlug === "ice-hockey") {
      countFirstScores = 7;
    } else {
      countFirstScores = 60;
    }

    const scoresFiltered = scores
      .slice(3)
      .sort((a, b) => b.probability - a.probability)
      .slice(0, countFirstScores);

    // Объединяем два массива
    const combinedScores = [
      ...new Map(
        firstThreeScores
          .concat(scoresFiltered)
          .map((item) => [item.score, item])
      ).values(),
    ];

    // Проверяем совпадение каждого score с bet и учитываем вес (quantity)
    for (const score of combinedScores) {
      const [homeGoals, awayGoals] = score.score.split(":").map(Number);
      const weight = score.quantity;

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

  const uniqueTypes = new Set();

  // 2. Filter bets while keeping track of processed types
  return bets.filter((bet) => {
    if (!uniqueTypes.has(bet.type)) {
      uniqueTypes.add(bet.type);
      return true;
    }
    return false;
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
  sportSlug: string
) => {
  // 1. Преобразование объекта в массив объектов для сортировки
  const resultsArray = Object.entries(data).map(([score, values]) => ({
    score,
    ...values,
  }));

  // 2. Сортировка массива по quantity (убыванию)
  resultsArray.sort((a, b) => b.quantity - a.quantity).slice(0, 10);

  console.log(resultsArray);
  // console.log(odds);

  const arrayOdds = convertObjectToArray(odds);

  console.log(arrayOdds);

  // const [homeGoals, awayGoals] = score.split(":").map(Number);

  let scoresArray;

  if (sportSlug === "soccer") {
    scoresArray = resultsArray.slice(0, 10);
  } else if (sportSlug === "ice-hockey") {
    scoresArray = resultsArray.slice(0, 15);
  } else {
    scoresArray = resultsArray.slice(0, 100);
  }

  const result = calculateBetMatchPercentage(arrayOdds, scoresArray, sportSlug)
    .filter((el) => (el.value >= 1.5 && el.percent ? el.percent > 40 : false))
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
  console.log(uniqueData);

  return {
    bets: uniqueData.slice(0, 3),
    scores: resultsArray.slice(0, 10),
  };
};

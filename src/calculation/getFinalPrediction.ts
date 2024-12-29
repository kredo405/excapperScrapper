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
  }; // Поле для хранения процента подходящих счетов
}

interface Score {
  score: string;
  probability: number;
  quantity: number;
}

function calculateBetMatchPercentage(bets: Bet[], scores: Score[]): Bet[] {
  return bets.map((bet) => {
    let matchingScores = 0;

    for (const score of scores) {
      const [homeGoals, awayGoals] = score.score.split(":").map(Number);
      if (
        isScoreMatchingPrediction(bet.type, bet.outcome, homeGoals, awayGoals)
      ) {
        matchingScores++;
      }
    }

    const percent = (matchingScores / scores.length) * 100;
    return { ...bet, percent: Math.round(percent), name: formatBets(bet) }; // Округляем процент до целого
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

  if (sportSlug === "sofootball") {
    scoresArray = resultsArray.slice(0, 10);
  } else if (sportSlug === "ice-hockey") {
    scoresArray = resultsArray.slice(0, 5);
  } else {
    scoresArray = resultsArray.slice(0, 30);
  }

  const result = calculateBetMatchPercentage(arrayOdds, scoresArray)
    .filter((el) => (el.value >= 1.6 && el.percent ? el.percent > 40 : false))
    .sort((a, b) => (a.percent && b.percent ? b.percent - a.percent : 0))
    .slice(0, 7);
  console.log(result);

  return {
    bets: result.slice(0, 3),
    scores: resultsArray.slice(0, 10),
  };
};

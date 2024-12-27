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

export const getFinalPrediction = (
  data: Probabilites,
  odds: Odds | undefined
) => {
  // 1. Преобразование объекта в массив объектов для сортировки
  const resultsArray = Object.entries(data).map(([score, values]) => ({
    score,
    ...values,
  }));

  // 2. Сортировка массива по quantity (убыванию)
  resultsArray.sort((a, b) => b.quantity - a.quantity);
  const finalScores = resultsArray.slice(0, 5).map((el) => {
    const { bets } = el;

    const newBets = bets.map((item) => {
      const odd = odds?.[item.type]?.[item.outcome]?.value;
      const name = formatBets(item);
      return {
        ...item,
        odd: odd,
        name: name,
      };
    });

    const newBetsFilter = newBets.filter((el) => el.count > 1);

    newBetsFilter.sort((a, b) => b.roi - a.roi);

    return { ...el, bets: newBetsFilter.slice(0, 3) };
  });

  const predictions = finalScores
    .map((el) => {
      return el.bets;
    })
    .flat()
    .filter((el) => el.odd !== undefined && el.odd >= 1.5);

  const uniqueData = Array.from(
    new Map(
      predictions.map((item) => [`${item.type}:${item.outcome}`, item])
    ).values()
  );

  const unquePredictionSorted = uniqueData
    .sort((a, b) => b.roi - a.roi)
    .slice(0, 3);

  console.log(resultsArray);

  console.log(unquePredictionSorted);

  const result = unquePredictionSorted.map((prediction) => {
    const matchingScores = resultsArray.slice(0, 15).filter((score) => {
      const [homeGoals, awayGoals] = score.score.split(":").map(Number);
      if (
        isScoreMatchingPrediction(
          prediction.type,
          prediction.outcome,
          homeGoals,
          awayGoals
        )
      ) {
        return true;
      } else {
        return false;
      }
    });
    const percentage = (matchingScores.length / 15) * 100;

    return {
      ...prediction,
      matchingPercentage: percentage.toFixed(2), // Процент подходящих счетов
    };
  });

  const resultSorted = result
    .sort((a, b) => +b.matchingPercentage - +a.matchingPercentage)
    .slice(0, 2);
  console.log(resultSorted);

  return resultSorted;
};

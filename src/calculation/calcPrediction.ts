// import { scoresMatch } from "../data/scoresFootball";
// import { calcAvgGoals } from "./calcAvgGoals";
// import { oddsFootball } from "../data/betsFootball";
// import { monteCarloScoreSimulation } from "./calcMoncarlo";
// import { Matches } from "../types/statistics";
// import { Team } from "../types/statistics";
// import { Predict } from "../types/predictions";
// import { AvrrageStatistics } from "../types/aveageStatistics";
// import { Predictors } from "../types/predictors";

// interface Outcome {
//   name: string;
//   odd: number;
//   scores: string[];
// }

// export function calcPrediction(
//   matches: Matches,
//   teams: { home: Team; away: Team },
//   predictions: Predict[] | undefined,
//   predictors: Predictors[] | undefined,
//   averageStatistics: AvrrageStatistics
// ) {
//   const data: Outcome[] = [];

// const homeTeamName = teams.home.shortName;
// const awayTeamName = teams.away.shortName;

// const scoresMatchCopy: { [score: string]: any } = JSON.parse(
//   JSON.stringify(scoresMatch)
// );

// const avgGoalsHome = calcAvgGoals(matches.pastHome, homeTeamName);
// const avgGoalsAway = calcAvgGoals(matches.pastAway, awayTeamName);

// const individualTotalHome =
//   (avgGoalsHome.avgGoalsFor + avgGoalsAway.avgGoalsAgainst) / 2;
// const individualTotalAway =
//   (avgGoalsAway.avgGoalsFor + avgGoalsHome.avgGoalsAgainst) / 2;

// const probabilities = monteCarloScoreSimulation(
//   individualTotalHome,
//   individualTotalAway,
//   100000
// );

// predictions?.forEach((prediction) => {
//   // Добавляем все прогнозы
//   if (
//     oddsFootball.hasOwnProperty(prediction.type) &&
//     (oddsFootball as any)[prediction.type].hasOwnProperty(prediction.outcome)
//   ) {
//     data.push({
//       odd: prediction.rate,
//       name: (oddsFootball as any)[prediction.type][prediction.outcome].name,
//       scores: (oddsFootball as any)[prediction.type][prediction.outcome]
//         .scores,
//     });
//   }
// });

// data.forEach((el) => {
//   el.scores.forEach((score) => {
//     scoresMatchCopy[score].quantity += scoresMatchCopy[score].probability;
//   });
// });

// // Функция нормализации вероятностей, чтобы сумма равнялась 100%
// function normalizeProbabilities(probabilities: { [score: string]: number }) {
//   const total = Object.values(probabilities).reduce(
//     (acc, val) => acc + val,
//     0
//   );
//   Object.keys(probabilities).forEach((key) => {
//     probabilities[key] = (probabilities[key] / total) * 100;
//   });
//   return probabilities;
// }

// // Нормализуем вероятности Монте-Карло
// const normalizedProbabilities = normalizeProbabilities(probabilities);

// // Рассчитываем итоговые вероятности с учетом мировых данных
// for (let score in normalizedProbabilities) {
//   if (scoresMatchCopy[score]) {
//     scoresMatchCopy[score].probability =
//       (normalizedProbabilities[score] +
//         scoresMatchCopy[score].worldProbabilty) /
//       2;
//   }
// }

// data.forEach((el) => {
//   el.scores.forEach((score) => {
//     scoresMatchCopy[score].quantity += scoresMatchCopy[score].probability;
//   });
// });

// function findTop3ByQuantity(scoresMatchCopy: { [score: string]: any }) {
//   // Преобразуем объект в массив, чтобы сортировать
//   const entries = Object.entries(scoresMatchCopy);

//   // Сортируем массив по значению `quantity` в порядке убывания
//   entries.sort((a, b) => b[1].quantity - a[1].quantity);

//   // Берём первые 3 результата и возвращаем их в виде объекта
//   const top3 = entries.slice(0, 3);

//   // Преобразуем массив обратно в объект
//   return Object.fromEntries(top3);
// }

// // Пример использования
// const top3Scores = findTop3ByQuantity(scoresMatchCopy);

// const top3ScoresKeys = Object.keys(top3Scores);
// console.log(top3ScoresKeys);

// const topPredictions = [];

// for (let type in oddsFootball) {
//   for (let outcome in (oddsFootball as any)[type]) {
//     if (
//       (oddsFootball as any)[type][outcome].scores.find(
//         (el: string) => el === top3ScoresKeys[0]
//       ) &&
//       (oddsFootball as any)[type][outcome].scores.find(
//         (el: string) => el === top3ScoresKeys[1]
//       ) &&
//       (oddsFootball as any)[type][outcome].scores.find(
//         (el: string) => el === top3ScoresKeys[2]
//       )
//     ) {
//       topPredictions.push({
//         name: (oddsFootball as any)[type][outcome].name,
//       });
//     }
//   }
// }

// console.log(topPredictions);

//   const topPredictionsFiltered = topPredictions.filter((el) => {
//     return el !== undefined && el.historyOdds
//       ? el.historyOdds[el.historyOdds.length - 1][1] > 1.4
//       : false;
//   });

//   console.log(topPredictionsFiltered);

//   const topredicionSorted = topPredictionsFiltered.sort(
//     (a, b) => b.probability - a.probability
//   );
// }

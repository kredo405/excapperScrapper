export interface Bets {
  type: string;
  outcome: string;
  count: number;
  roi: number;
}

export function monteCarloScoreSimulation(
  homeExpectedGoals: number,
  awayExpectedGoals: number,
  homeGoalLimit: number = 10, // Лимит голов для домашней команды
  awayGoalLimit: number = 10, // Лимит голов для гостевой команды
  simulations: number = 10000 // Количество симуляций
) {
  function poissonWithLimit(lambda: number, limit: number) {
    let L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
      k++;
      p *= Math.random();
    } while (p > L && k <= limit);
    return Math.max(0, Math.min(k - 1, limit));
  }

  let scoreProbabilities: {
    [score: string]: { probability: number; quantity: number; bets: Bets[] };
  } = {};

  // Выполняем симуляции
  for (let i = 0; i < simulations; i++) {
    let homeGoals = poissonWithLimit(homeExpectedGoals, homeGoalLimit);
    let awayGoals = poissonWithLimit(awayExpectedGoals, awayGoalLimit);

    // Формируем строку вида "homeGoals:awayGoals"
    let score = `${homeGoals}:${awayGoals}`;

    // Увеличиваем количество для данного счета
    if (scoreProbabilities[score]) {
      scoreProbabilities[score].probability++;
    } else {
      scoreProbabilities[score] = { probability: 1, quantity: 0, bets: [] };
    }
  }

  // Преобразуем количество в вероятности
  for (let score in scoreProbabilities) {
    scoreProbabilities[score].probability =
      (scoreProbabilities[score].probability / simulations) * 100;
  }

  return scoreProbabilities;
}

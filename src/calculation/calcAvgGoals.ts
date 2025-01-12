import { Match } from "../types/matches";

interface ConvertedMatch {
  homeTeam: string;
  awayTeam: string;
  homeGoalsMin: number;
  awayGoalsMin: number;
  xgHome?: number;
  xgAway?: number;
  homeOdds?: number | undefined;
  awayOdds?: number | undefined;
}

function dataConversion(
  data: Match[] | undefined,
  goalLimit: number,
  sportSlug: string
): ConvertedMatch[] | undefined {
  return data?.map((el) => {
    const [homeGoals, awayGoals] = el.result.total.split(":").map(Number);
    const homeGoalsMin = Math.min(homeGoals, goalLimit);
    const awayGoalsMin = Math.min(awayGoals, goalLimit);

    const match: ConvertedMatch = {
      homeTeam: el.teams.home.shortName,
      awayTeam: el.teams.away.shortName,
      homeGoalsMin,
      awayGoalsMin,
      homeOdds: el.odds?.one_x_two
        ? el.odds?.one_x_two.w1.value
        : el.odds?.one_two.w1.value,
      awayOdds: el.odds?.one_x_two
        ? el.odds?.one_x_two.w2.value
        : el.odds?.one_two.w2.value,
    };

    if (sportSlug === "soccer") {
      match.xgHome = el.teams.home.statistic?.xg;
      match.xgAway = el.teams.away.statistic?.xg;
    }

    return match;
  });
}

function adjustGoalsForOpponentStrength(
  goals: number,
  opponentOdds: number | undefined
): number {
  if (opponentOdds === undefined || opponentOdds <= 0) return goals;

  const strengthFactor = 1 / opponentOdds; // Чем ниже коэффициент, тем сильнее соперник
  const adjustedGoals = goals * Math.pow(0.9, strengthFactor); // Уменьшаем количество голов против сильных соперников
  return adjustedGoals;
}

function calculateWeight(isHome: boolean, homeWeight: number): number {
  return isHome ? homeWeight : 1;
}

export function calcAvgGoals(
  matches: Match[] | undefined,
  teamName: string,
  goalLimit: number = 5,
  sportSlug: string,
  homeWeight: number = 1.05
) {
  const historicalMatches = dataConversion(matches, goalLimit, sportSlug);

  if (!historicalMatches || historicalMatches.length === 0) {
    return { avgGoalsFor: 0, avgGoalsAgainst: 0 };
  }

  const stats = historicalMatches.reduce(
    (acc, match) => {
      const isHome = match.homeTeam === teamName;
      const isAway = match.awayTeam === teamName;

      if (isHome || isAway) {
        const goalsFor = isHome
          ? match.xgHome ?? match.homeGoalsMin
          : match.xgAway ?? match.awayGoalsMin;
        const goalsAgainst = isHome
          ? match.xgAway ?? match.awayGoalsMin
          : match.xgHome ?? match.homeGoalsMin;

        const opponentOdds = isHome ? match.awayOdds : match.homeOdds;

        // Корректируем количество голов в зависимости от силы соперника
        const adjustedGoalsFor = adjustGoalsForOpponentStrength(
          goalsFor,
          opponentOdds
        );
        const adjustedGoalsAgainst = adjustGoalsForOpponentStrength(
          goalsAgainst,
          opponentOdds
        );

        // Учитываем вес только для домашних матчей
        const weight = calculateWeight(isHome, homeWeight);

        acc.weightedGoalsFor += adjustedGoalsFor * weight;
        acc.weightedGoalsAgainst += adjustedGoalsAgainst * weight;
        acc.totalWeight += weight;
      }

      return acc;
    },
    { weightedGoalsFor: 0, weightedGoalsAgainst: 0, totalWeight: 0 }
  );

  return {
    avgGoalsFor:
      stats.totalWeight > 0 ? stats.weightedGoalsFor / stats.totalWeight : 0,
    avgGoalsAgainst:
      stats.totalWeight > 0
        ? stats.weightedGoalsAgainst / stats.totalWeight
        : 0,
  };
}

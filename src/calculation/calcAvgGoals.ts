import { LastMatch } from "../types/statistics";

function dataConversion(
  data: LastMatch[],
  goalLimit: number,
  sportSlug: string
): any[] {
  return data.map((el) => {
    const [homeGoals, awayGoals] = el.result.total.split(":").map(Number);
    // Получаем количество голов для каждой команды и применяем ограничитель
    const homeGoalsMin = Math.min(homeGoals, goalLimit);
    const awayGoalsMin = Math.min(awayGoals, goalLimit);

    if (sportSlug === "soccer") {
      return {
        homeTeam: el.teams.home.shortName,
        awayTeam: el.teams.away.shortName,
        homeGoalsMin: homeGoalsMin,
        awayGoalsMin: awayGoalsMin,
        homeGoalsFirstTime: Number(el.result.ht.split(":")[0]),
        awayGoalsFirstTime: Number(el.result.ht.split(":")[1]),
        homeGoalsSecondTime: homeGoalsMin - +el.result.ht.split(":")[0],
        awayGoalsSecondTime: awayGoalsMin - +el.result.ht.split(":")[1],
      };
    }
    if (sportSlug === "basketball") {
      return {
        homeTeam: el.teams.home.shortName,
        awayTeam: el.teams.away.shortName,
        homeGoalsMin: homeGoalsMin,
        awayGoalsMin: awayGoalsMin,
        // homeGoalsQuarter1: +el.result["1"].split(":")[0],
        // awayGoalsQuarter1: +el.result["1"].split(":")[1],
        // homeGoalsQuarter2: +el.result["2"].split(":")[0],
        // awayGoalsQuarter2: +el.result["2"].split(":")[1],
        // homeGoalsQuarter3: +el.result["3"].split(":")[0],
        // awayGoalsQuarter3: +el.result["3"].split(":")[1],
        // homeGoalsQuarter4: +el.result["4"].split(":")[0],
        // awayGoalsQuarter4: +el.result["4"].split(":")[1],
      };
    }
    if (sportSlug === "ice-hockey") {
      return {
        homeTeam: el.teams.home.shortName,
        awayTeam: el.teams.away.shortName,
        homeGoalsMin: homeGoalsMin,
        awayGoalsMin: awayGoalsMin,
      };
    }
    if (sportSlug === undefined) {
      return {
        homeTeam: el.teams.home.shortName,
        awayTeam: el.teams.away.shortName,
        homeGoalsMin: homeGoalsMin,
        awayGoalsMin: awayGoalsMin,
      };
    }
  });
}

export function calcAvgGoals(
  matches: LastMatch[],
  teamName: string,
  goalLimit: number = 5,
  sportSlug: string
) {
  const historicalMatches = dataConversion(matches, goalLimit, sportSlug);

  let stats = {
    totalGoalsFor: 0,
    totalGoalsAgainst: 0,
    countMatches: 0,
    totalGoalsForQuarter1: 0,
    totalGoalsAgainstQuarter1: 0,
    totalGoalsForQuarter2: 0,
    totalGoalsAgainstQuarter2: 0,
    totalGoalsForQuarter3: 0,
    totalGoalsAgainstQuarter3: 0,
    totalGoalsForQuarter4: 0,
    totalGoalsAgainstQuarter4: 0,
    totalGoalsForFirstTime: 0,
    totalGoalsAgainstFirstTime: 0,
    totalGoalsForSecondTime: 0,
    totalGoalsAgainstSecondTime: 0,
  };

  historicalMatches.forEach((match) => {
    if (match.homeTeam === teamName || match.awayTeam === teamName) {
      const isHome = match.homeTeam === teamName;
      const goalsFor = isHome ? match.homeGoalsMin : match.awayGoalsMin;
      const goalsAgainst = isHome ? match.awayGoalsMin : match.homeGoalsMin;
      stats.countMatches++;

      // Для футбола
      if (sportSlug === "soccer") {
        const totalGoalsForFirstTime = isHome
          ? match.homeGoalsFirstTime
          : match.awayGoalsFirstTime;
        const totalGoalsAgainstFirstTime = isHome
          ? match.awayGoalsFirstTime
          : match.homeGoalsFirstTime;
        const totalGoalsForSecondTime = isHome
          ? match.homeGoalsSecondTime
          : match.awayGoalsSecondTime;
        const totalGoalsAgainstSecondTime = isHome
          ? match.awayGoalsSecondTime
          : match.homeGoalsSecondTime;

        stats.totalGoalsFor += goalsFor;
        stats.totalGoalsAgainst += goalsAgainst;
        stats.totalGoalsForFirstTime += totalGoalsForFirstTime;
        stats.totalGoalsAgainstFirstTime += totalGoalsAgainstFirstTime;
        stats.totalGoalsForSecondTime += totalGoalsForSecondTime;
        stats.totalGoalsAgainstSecondTime += totalGoalsAgainstSecondTime;
      }

      // Для баскетбола
      else if (sportSlug === "basketball") {
        stats.totalGoalsFor += goalsFor;
        stats.totalGoalsAgainst += goalsAgainst;
        stats.totalGoalsForQuarter1 += isHome
          ? match.homeGoalsQuarter1
          : match.awayGoalsQuarter1;
        stats.totalGoalsAgainstQuarter1 += isHome
          ? match.awayGoalsQuarter1
          : match.homeGoalsQuarter1;
        stats.totalGoalsForQuarter2 += isHome
          ? match.homeGoalsQuarter2
          : match.awayGoalsQuarter2;
        stats.totalGoalsAgainstQuarter2 += isHome
          ? match.awayGoalsQuarter2
          : match.homeGoalsQuarter2;
        stats.totalGoalsForQuarter3 += isHome
          ? match.homeGoalsQuarter3
          : match.awayGoalsQuarter3;
        stats.totalGoalsAgainstQuarter3 += isHome
          ? match.awayGoalsQuarter3
          : match.homeGoalsQuarter3;
        stats.totalGoalsForQuarter4 += isHome
          ? match.homeGoalsQuarter4
          : match.awayGoalsQuarter4;
        stats.totalGoalsAgainstQuarter4 += isHome
          ? match.awayGoalsQuarter4
          : match.homeGoalsQuarter4;
      }
      // Для хоккея
      else if (sportSlug === "ice-hockey") {
        stats.totalGoalsFor += goalsFor;
        stats.totalGoalsAgainst += goalsAgainst;
      } else {
        stats.totalGoalsFor += goalsFor;
        stats.totalGoalsAgainst += goalsAgainst;
      }
    }
  });

  // Рассчитываем средние значения для всех видов спорта
  let avgGoalsFor = 0;
  let avgGoalsAgainst = 0;
  let avgGoalsFirtsTimeFor = 0;
  let avgGoalsSecondTimeFor = 0;
  let avgGoalsFirtsTimeAgainst = 0;
  let avgGoalsSecondTimeAgainst = 0;
  let avgGoalsForQuarter1 = 0;
  let avgGoalsAgainstQuarter1 = 0;
  let avgGoalsForQuarter2 = 0;
  let avgGoalsAgainstQuarter2 = 0;
  let avgGoalsForQuarter3 = 0;
  let avgGoalsAgainstQuarter3 = 0;
  let avgGoalsForQuarter4 = 0;
  let avgGoalsAgainstQuarter4 = 0;

  if (sportSlug === "soccer") {
    avgGoalsFor =
      stats.countMatches > 0 ? stats.totalGoalsFor / stats.countMatches : 0;
    avgGoalsAgainst =
      stats.countMatches > 0 ? stats.totalGoalsAgainst / stats.countMatches : 0;
    avgGoalsFirtsTimeFor =
      stats.countMatches > 0
        ? stats.totalGoalsForFirstTime / stats.countMatches
        : 0;
    avgGoalsSecondTimeFor =
      stats.countMatches > 0
        ? stats.totalGoalsForSecondTime / stats.countMatches
        : 0;
    avgGoalsFirtsTimeAgainst =
      stats.countMatches > 0
        ? stats.totalGoalsAgainstFirstTime / stats.countMatches
        : 0;
    avgGoalsSecondTimeAgainst =
      stats.countMatches > 0
        ? stats.totalGoalsAgainstSecondTime / stats.countMatches
        : 0;
  } else if (sportSlug === "basketball") {
    avgGoalsFor =
      stats.countMatches > 0 ? stats.totalGoalsFor / stats.countMatches : 0;
    avgGoalsAgainst =
      stats.countMatches > 0 ? stats.totalGoalsAgainst / stats.countMatches : 0;
    avgGoalsForQuarter1 =
      stats.countMatches > 0
        ? stats.totalGoalsForQuarter1 / stats.countMatches
        : 0;
    avgGoalsAgainstQuarter1 =
      stats.countMatches > 0
        ? stats.totalGoalsAgainstQuarter1 / stats.countMatches
        : 0;
    avgGoalsForQuarter2 =
      stats.countMatches > 0
        ? stats.totalGoalsForQuarter2 / stats.countMatches
        : 0;
    avgGoalsAgainstQuarter2 =
      stats.countMatches > 0
        ? stats.totalGoalsAgainstQuarter2 / stats.countMatches
        : 0;
    avgGoalsForQuarter3 =
      stats.countMatches > 0
        ? stats.totalGoalsForQuarter3 / stats.countMatches
        : 0;
    avgGoalsAgainstQuarter3 =
      stats.countMatches > 0
        ? stats.totalGoalsAgainstQuarter3 / stats.countMatches
        : 0;
    avgGoalsForQuarter4 =
      stats.countMatches > 0
        ? stats.totalGoalsForQuarter4 / stats.countMatches
        : 0;
    avgGoalsAgainstQuarter4 =
      stats.countMatches > 0
        ? stats.totalGoalsAgainstQuarter4 / stats.countMatches
        : 0;
  } else if (sportSlug === "ice-hockey") {
    avgGoalsFor =
      stats.countMatches > 0 ? stats.totalGoalsFor / stats.countMatches : 0;
    avgGoalsAgainst =
      stats.countMatches > 0 ? stats.totalGoalsAgainst / stats.countMatches : 0;
  }

  if (sportSlug === "soccer") {
    return {
      avgGoalsFor,
      avgGoalsAgainst,
      avgGoalsFirtsTimeFor,
      avgGoalsSecondTimeFor,
      avgGoalsFirtsTimeAgainst,
      avgGoalsSecondTimeAgainst,
    };
  } else if (sportSlug === "basketball") {
    return {
      avgGoalsFor,
      avgGoalsAgainst,
      avgGoalsForQuarter1,
      avgGoalsAgainstQuarter1,
      avgGoalsForQuarter2,
      avgGoalsAgainstQuarter2,
      avgGoalsForQuarter3,
      avgGoalsAgainstQuarter3,
      avgGoalsForQuarter4,
      avgGoalsAgainstQuarter4,
    };
  } else if (sportSlug === "ice-hockey") {
    return {
      avgGoalsFor,
      avgGoalsAgainst,
    };
  } else {
    return {
      avgGoalsFor,
      avgGoalsAgainst,
    };
  }
}

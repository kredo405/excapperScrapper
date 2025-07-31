// Функция для определения, подходит ли счет под указанный прогноз
export function isScoreMatchingPrediction(
  type: string,
  outcome: string,
  homeGoals: number,
  awayGoals: number
) {
  if (type === "total_under") {
    const total = parseFloat(outcome.replace("_", "."));
    return homeGoals + awayGoals < total;
  } else if (type === "total_over") {
    const total = parseFloat(outcome.replace("_", "."));
    return homeGoals + awayGoals > total;
  } else if (type === "both_to_score" && outcome === "no") {
    return (
      (homeGoals === 0 && awayGoals === 0) ||
      (homeGoals > 0 && awayGoals === 0) ||
      (homeGoals === 0 && awayGoals > 0)
    );
  } else if (type === "both_to_score" && outcome === "yes") {
    return homeGoals > 0 && awayGoals > 0;
  } else if (type === "double_chance" && outcome === "w12") {
    return homeGoals !== awayGoals;
  } else if (type === "double_chance" && outcome === "x1") {
    return homeGoals === awayGoals || homeGoals > awayGoals;
  } else if (type === "double_chance" && outcome === "x2") {
    return homeGoals === awayGoals || homeGoals < awayGoals;
  } else if (type === "handicap1") {
    const handicap = parseFloat(outcome.replace("_", "."));
    return homeGoals + handicap > awayGoals;
  } else if (type === "handicap2") {
    const handicap = parseFloat(outcome.replace("_", "."));
    return awayGoals + handicap > homeGoals;
  } else if (type === "one_x_two" && outcome === "w1") {
    return homeGoals > awayGoals;
  } else if (type === "one_x_two" && outcome === "w2") {
    return homeGoals < awayGoals;
  } else if (type === "one_x_two" && outcome === "x") {
    return homeGoals === awayGoals;
  } else if (type === "total_t1_over") {
    const goals = parseFloat(outcome.replace("_", "."));
    return homeGoals > goals;
  } else if (type === "total_t1_under") {
    const goals = parseFloat(outcome.replace("_", "."));
    return homeGoals < goals;
  } else if (type === "total_t2_over") {
    const goals = parseFloat(outcome.replace("_", "."));
    return awayGoals > goals;
  } else if (type === "total_t2_under") {
    const goals = parseFloat(outcome.replace("_", "."));
    return awayGoals < goals;
  } else if (type === "one_two" && outcome === "w1") {
    return homeGoals > awayGoals;
  } else if (type === "one_two" && outcome === "w2") {
    return homeGoals < awayGoals;
  }


  return false;
}

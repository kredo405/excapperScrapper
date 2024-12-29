import { Bet } from "./getFinalPrediction";
import { Predict } from "../types/predictions";

export const formatBets = (bet: Bet | Predict) => {
  const { type, outcome } = bet;
  if (type === "total_under") {
    const total = parseFloat(outcome.replace("_", "."));
    return {
      name: `Тотал меньше ${total}`,
      shortName: `ТМ ${total}`,
    };
  } else if (type === "total_over") {
    const total = parseFloat(outcome.replace("_", "."));
    return {
      name: `Тотал больше ${total}`,
      shortName: `ТБ ${total}`,
    };
  } else if (type === "both_to_score" && outcome === "no") {
    return {
      name: `Обе забьют Нет`,
      shortName: `ОЗ Нет`,
    };
  } else if (type === "both_to_score" && outcome === "yes") {
    return {
      name: `Обе забьют ДА`,
      shortName: `ОЗ ДА`,
    };
  } else if (type === "double_chance" && outcome === "w12") {
    return {
      name: `Ничьей не будет`,
      shortName: `12`,
    };
  } else if (type === "double_chance" && outcome === "x1") {
    return {
      name: `Победа 1 или ничья`,
      shortName: `1Х`,
    };
  } else if (type === "double_chance" && outcome === "x2") {
    return {
      name: `Победа 2 или ничья`,
      shortName: `Х2`,
    };
  } else if (type === "handicap1") {
    const handicap = parseFloat(outcome.replace("_", "."));
    return {
      name: `Фора 1 ${handicap}`,
      shortName: `Ф1 ${handicap}`,
    };
  } else if (type === "handicap2") {
    const handicap = parseFloat(outcome.replace("_", "."));
    return {
      name: `Фора 2 ${handicap}`,
      shortName: `Ф2 ${handicap}`,
    };
  } else if (type === "one_x_two" && outcome === "w1") {
    return {
      name: `Победа 1`,
      shortName: `П1`,
    };
  } else if (type === "one_x_two" && outcome === "w2") {
    return {
      name: `Победа 2`,
      shortName: `П2`,
    };
  } else if (type === "one_x_two" && outcome === "x") {
    return {
      name: `Ничья`,
      shortName: `Х`,
    };
  } else if (type === "total_t1_over") {
    const goals = parseFloat(outcome.replace("_", "."));
    return {
      name: `Индивидуальный тотал 1 больше ${goals}`,
      shortName: `ИТ1Б ${goals}`,
    };
  } else if (type === "total_t1_under") {
    const goals = parseFloat(outcome.replace("_", "."));
    return {
      name: `Индивидуальный тотал 1 меньше ${goals}`,
      shortName: `ИТ1М ${goals}`,
    };
  } else if (type === "total_t2_over") {
    const goals = parseFloat(outcome.replace("_", "."));
    return {
      name: `Индивидуальный тотал 2 больше ${goals}`,
      shortName: `ИТ2Б ${goals}`,
    };
  } else if (type === "total_t2_under") {
    const goals = parseFloat(outcome.replace("_", "."));
    return {
      name: `Индивидуальный тотал 2 меньше ${goals}`,
      shortName: `ИТ2М ${goals}`,
    };
  } else if (type === "one_two" && outcome === "w1") {
    return {
      name: `Победа 1`,
      shortName: `П1`,
    };
  } else if (type === "one_two" && outcome === "w2") {
    return {
      name: `Победа 2`,
      shortName: `П2`,
    };
  }
};

import { PopularBets } from "./PopularBets";
import { ErrorModal } from "./ErrorModal";
import { Loading } from "./Loading";
import apiService from "../services/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Predict } from "../types/predictions";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
// import { Bets } from "../calculation/calcMoncarlo";
import { formatBets } from "../calculation/formatBets";
import { Bet } from "../calculation/getFinalPrediction";
import { Match } from "../types/matches";
import { Predictors } from "../types/predictors";
import { Odds } from "../types/odds";
// import { calcPrediction } from "../calculation/calcPrediction";
import {
  collection,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { firestore } from "../services/firebase";
import { calcPredictionsCollective } from "../calculation/calcPredictionsCollective";

interface Result {
  bets: Bet[];
}

// interface LastMatches {
//   match: Match[] | undefined;
//   odds: Odds[] | undefined;
// }

type MatchWithOdds = Match & { odds?: Odds };

export const Predictions: React.FC = () => {
  const { link } = useParams<{ link: string }>();

  const [predictions, setPredictions] = useState<Predict[]>();
  const [predictors, setPredictors] = useState<Predictors[]>();
  const [odds, setOdds] = useState<Odds>();
  const [result, setResult] = useState<Result>();
  const [loadingCount, setLoadingCount] = useState(0);
  const [homeTeamLastMatches, setHomeTeamLastMatches] = useState<
    MatchWithOdds[] | undefined
  >();
  const [awayTeamLastMatches, setAwayTeamLastMatches] = useState<
    Match[] | undefined
  >();
  const [value, setValue] = useState(1.5);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseFloat(e.target.value));
  };

  // const lastMatchesData = useSelector(
  //   (state: RootState) => state.statistics.statistics.matches
  // );

  const teamsData = useSelector(
    (state: RootState) => state.statistics.statistics.teams
  );

  const sport = useSelector((state: RootState) => state.sport.currentSport);

  const onClickCalcPredictions = () => {
    // const resTest = calcPrediction(
    //   homeTeamLastMatches,
    //   awayTeamLastMatches,
    //   teamsData,
    //   predictors,
    //   predictions,
    //   odds,
    //   value
    // );

    const res = calcPredictionsCollective(
      homeTeamLastMatches,
      awayTeamLastMatches,
      teamsData,
      predictors,
      predictions,
      odds,
      value
    );

    setResult(res);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingCount((count) => count + 1); // Начинаем загрузку

        // Получаем прогнозы и коэффициенты
        const firstResponsePredictions = await apiService.getPredictions({
          link: link,
          limit: 15,
          offset: 0,
        });

        const total = firstResponsePredictions.predictions.meta.total;
        const limit = 15;
        const totalRequests = Math.ceil(total / limit);

        const requestsPredictions = Array.from(
          { length: totalRequests },
          (_, index) =>
            apiService.getPredictions({
              link: link,
              limit,
              offset: index * limit,
            })
        );

        const responsesPredictions = await Promise.all(requestsPredictions);

        const allPredictions = responsesPredictions.flatMap(
          (response) => response.predictions.data.predictions
        );

        const oddsResponse = await apiService.getOdds({ link: link });
        const odds = oddsResponse.odds.data.odds;

        setPredictions(allPredictions);
        setOdds(odds);
      } catch (error) {
        ErrorModal(`Failed to fetch matches: ${error}`);
      } finally {
        setLoadingCount((count) => count - 1); // Завершаем загрузку
      }
    };

    const fetchLastMatchesAndOdds = async (
      sport: string | undefined,
      slug: string,
      team: string
    ) => {
      try {
        setLoadingCount((count) => count + 1);

        const matchesResponse = await apiService.getLastMatches({
          sport,
          slug,
          offset: 0,
        });

        const matches = matchesResponse.lastMatches.data;

        // Обновляем матчи с коэффициентами
        const matchesWithOdds = await Promise.all(
          matches.map(async (match: Match) => {
            try {
              const oddsResponse = await apiService.getOdds({
                link: match.slug,
              });

              return {
                ...match,
                odds: oddsResponse.odds.data.odds,
              };
            } catch (error) {
              console.error(
                `Failed to fetch odds for match ${match.id}:`,
                error
              );
              return match; // Возвращаем матч без коэффициентов в случае ошибки
            }
          })
        );

        if (team === "home") {
          setHomeTeamLastMatches(matchesWithOdds);
        } else {
          setAwayTeamLastMatches(matchesWithOdds);
        }
      } catch (error) {
        ErrorModal(`Failed to fetch matches for team ${team}: ${error}`);
      } finally {
        setLoadingCount((count) => count - 1); // Завершаем загрузку
      }
    };

    fetchData();
    fetchLastMatchesAndOdds(sport, teamsData.home.slug, "home");
    fetchLastMatchesAndOdds(sport, teamsData.away.slug, "away");
  }, [link]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingCount((count) => count + 1); // Начинаем загрузку

        const querySnapshot = await getDocs(
          collection(firestore, "predictors")
        );
        const items: Predictors[] = querySnapshot.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData>) => ({
            id: doc.id,
            ...(doc.data() as Omit<Predictors, "id">),
          })
        );

        setPredictors(items);
      } catch (error) {
        console.error("Ошибка получения данных:", error);
      } finally {
        setLoadingCount((count) => count - 1); // Завершаем загрузку
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {loadingCount > 0 ? (
        <Loading />
      ) : (
        <div className="px-2 md:px-44">
          <h2 className="text-slate-200 font-mono mt-10 text-center">
            Кол-во Прогнозов: {predictions?.length}
          </h2>
          <h2 className="text-slate-200 font-mono mt-10 text-center">
            Выберите минимальный коэффициент
          </h2>
          <div className="flex justify-center mt-2">
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="3"
                step="0.01"
                value={value}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-lg font-semibold text-slate-200">
                {value.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-10">
            <button
              onClick={onClickCalcPredictions}
              className="bg-sky-800 hover:bg-sky-900 text-slate-200 font-mono py-2 px-4 rounded-xl"
            >
              Рассчитать прогноз
            </button>
          </div>

          <div className="flex flex-col justify-center mt-10">
            {result ? (
              <>
                <div className="flex space-x-4">
                  <div className="flex items-center ">
                    <span className="w-5 h-5 bg-red-500"></span>
                    <span className="text-slate-200 mt-2 pl-2">
                      - Низкая Вероятность
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-5 h-5 bg-lime-500"></span>
                    <span className="text-slate-200 mt-2 pl-2">
                      - Высокая Вероятность
                    </span>
                  </div>
                </div>
                <div>
                  <div>
                    <div>
                      <span className="font-bold text-orange-500">Цен. -</span>{" "}
                      <span className="text-slate-200">
                        Число рассчитанное программой, которое отображает
                        качество прогноза
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-orange-500">% -</span>{" "}
                      <span className="text-slate-200">
                        Вероятность прогноза
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-orange-500">Вес -</span>{" "}
                      <span className="text-slate-200">
                        Пересенная которая отображает влияние прогнозов
                        экспертов на итоговый прогноз
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-orange-500">ROI -</span>{" "}
                      <span className="text-slate-200">
                        Успешность прогнозиста
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-orange-500">$ -</span>{" "}
                      <span className="text-slate-200">
                        Прибыль прогнозиста
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-orange-500">В -</span>{" "}
                      <span className="text-slate-200">
                        Количество выигранных ставок прогнозиста
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-orange-500">П -</span>{" "}
                      <span className="text-slate-200">
                        Количество проигранных ставок прогнозиста
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-orange-500">Место -</span>{" "}
                      <span className="text-slate-200">
                        Место прогнозиста в рейтинге прогнозистов
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
            <div>
              {result?.bets.map((el) => {
                return (
                  <div>
                    <div className="flex items-center justify-between mt-2 p-2">
                      <span className="text-slate-300 font-mono font-bold px-3 w-4/12">
                        Ставка
                      </span>
                      <span className="text-slate-300 font-mono font-bold px-3 w-2/12 text-center">
                        Кэф
                      </span>
                      <span className="text-slate-300 font-mono font-bold px-3 w-2/12 text-center">
                        Цен.
                      </span>
                      <span className="text-slate-300 font-mono font-bold px-3 w-2/12 text-center">
                        %
                      </span>
                      <span className="text-slate-300 font-mono font-bold px-3 w-2/12 text-center">
                        Вес
                      </span>
                    </div>
                    <div className="flex justify-between rounded-t-xl items-center bg-slate-700 mt-2 p-2">
                      <span className="text-slate-200 font-mono px-3 text-sm w-4/12">
                        {" "}
                        {el.name?.name}{" "}
                      </span>
                      <span className="text-orange-500 font-mono px-3 text-sm w-2/12 text-center">
                        {" "}
                        {el.value}{" "}
                      </span>
                      <span
                        className={
                          el.percent && el.percent >= 60
                            ? "text-lime-500 font-mono px-3 text-sm w-2/12 text-center"
                            : "text-red-500 font-mono px-3 text-sm w-2/12 text-center"
                        }
                      >
                        {" "}
                        {el.percent}{" "}
                      </span>
                      <span
                        className={
                          el.betProbability && el.betProbability >= 50
                            ? "text-lime-500 font-mono px-3 text-sm w-2/12 text-center"
                            : "text-red-500 font-mono px-3 text-sm w-2/12 text-center"
                        }
                      >
                        {" "}
                        {el.betProbability?.toFixed(0)}{" "}
                      </span>
                      <span className="text-sky-500 font-mono px-3 text-sm w-2/12 text-center">
                        {" "}
                        {el.weight?.toFixed(0)}{" "}
                      </span>
                    </div>
                    <div className="bg-slate-600 rounded-b-xl">
                      <div className="flex w-full">
                        <div className="text-slate-200 font-bold px-2 text-sm w-4/12">
                          прогноз
                        </div>
                        <div className="text-slate-200 font-bold px-2 text-center w-2/12">
                          Roi
                        </div>
                        <div className="text-slate-200 font-bold px-2 text-center w-2/12">
                          $
                        </div>
                        <div className="text-slate-200 font-bold px-2 text-center w-1/12">
                          В
                        </div>
                        <div className="text-slate-200 font-bold px-2 text-center w-1/12">
                          П
                        </div>
                        <div className="text-slate-200 font-bold px-2 text-center w-2/12">
                          Место
                        </div>
                      </div>
                      {el.predictions?.map((item) => {
                        return (
                          <div className="flex w-full border-b -2 border-slate-400 px-2 py-2">
                            <div className="text-orange-500 font-bold px-2 text-sm w-4/12">
                              {formatBets(item)?.name}
                            </div>
                            <div
                              className={
                                item.predictor && item.predictor?.roi > 0
                                  ? "text-lime-400 px-2 text-center w-2/12 text-sm"
                                  : "text-red-600 px-2 text-center w-2/12 text-sm"
                              }
                            >
                              {item.predictor?.roi}
                            </div>
                            <div
                              className={
                                item.predictor && item.predictor?.result > 0
                                  ? "text-lime-400 px-2 text-center w-2/12 text-sm"
                                  : "text-red-600 px-2 text-center w-2/12 text-sm"
                              }
                            >
                              {item.predictor?.result}
                            </div>
                            <div className="text-sky-400 px-2 text-center w-1/12 text-sm">
                              {item.predictor?.won}
                            </div>
                            <div className="text-orange-400 px-2 text-center w-1/12 text-sm">
                              {item.predictor?.lose}
                            </div>
                            <div
                              className={
                                item.predictor && item.predictor?.position < 500
                                  ? "text-lime-300 px-2 text-center w-2/12 text-sm"
                                  : "text-red-600 px-2 text-center w-2/12 text-sm"
                              }
                            >
                              {item.predictor?.position}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <PopularBets predictions={predictions} predictors={predictors} />
        </div>
      )}
    </>
  );
};

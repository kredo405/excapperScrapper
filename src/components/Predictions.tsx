import { PopularBets } from "./PopularBets";
import { ErrorModal } from "./ErrorModal";
import { Loading } from "./Loading";
import apiService from "../services/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Predict } from "../types/predictions";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Bets } from "../calculation/calcMoncarlo";
import { Bet } from "../calculation/getFinalPrediction";
// import { calcPrediction } from "../calculation/calcPrediction";
import { Predictors } from "../types/predictors";
import { Odds } from "../types/odds";
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
  scores: {
    probability: number;
    quantity: number;
    bets: Bets[];
    score: string;
  }[];
}

export const Predictions: React.FC = () => {
  const { link } = useParams<{ link: string }>();
  console.log(link);

  const [predictions, setPredictions] = useState<Predict[]>();
  const [predictors, setPredictors] = useState<Predictors[]>();
  const [odds, setOdds] = useState<Odds>();
  const [result, setResult] = useState<Result>();
  const [loadingCount, setLoadingCount] = useState(0);

  const lastMatchesData = useSelector(
    (state: RootState) => state.statistics.statistics.matches
  );

  const teamsData = useSelector(
    (state: RootState) => state.statistics.statistics.teams
  );

  // const averageStatistics = useSelector(
  //   (state: RootState) => state.statistics.averageStatistics
  // );

  const onClickCalcPredictions = () => {
    // const res = calcPrediction(
    //   lastMatchesData,
    //   teamsData,
    //   predictions,
    //   predictors,
    //   averageStatistics
    // );

    const res = calcPredictionsCollective(
      lastMatchesData,
      teamsData,
      predictors,
      predictions,
      odds
    );

    setResult(res);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingCount((count) => count + 1); // Начинаем загрузку

        // Получаем прогнозы и коэффициенты
        const firstResponse = await apiService.getPredictions({
          link: link,
          limit: 15,
          offset: 0,
        });

        const total = firstResponse.predictions.meta.total;
        const limit = 15;
        const totalRequests = Math.ceil(total / limit);

        const requests = Array.from({ length: totalRequests }, (_, index) =>
          apiService.getPredictions({
            link: link,
            limit,
            offset: index * limit,
          })
        );

        const responses = await Promise.all(requests);

        const allPredictions = responses.flatMap(
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

    fetchData();
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
              <div className="flex items-center border-b-2 border-slate-400 mt-2 p-2">
                <span className="text-slate-300 font-mono font-bold px-3 w-5/12">
                  Ставка
                </span>
                <span className="text-slate-300 font-mono font-bold px-3 w-3/12 text-center">
                  Кэф
                </span>
                <span className="text-slate-300 font-mono font-bold w-4/12 text-center">
                  Вероятность
                </span>
              </div>
            ) : (
              ""
            )}
            <div>
              {result?.bets.map((el) => {
                return (
                  <div className="flex rounded-xl items-center bg-slate-700 mt-2 p-2">
                    <span className="text-slate-200 font-mono px-3 w-5/12">
                      {" "}
                      {el.name?.name}{" "}
                    </span>
                    <span className="text-orange-500 font-mono px-3 w-3/12 text-center">
                      {" "}
                      {el.value}{" "}
                    </span>
                    <span className="text-sky-500 font-mono px-3 w-4/12 text-center">
                      {" "}
                      {el.percent?.toFixed(0)}{" "}
                    </span>
                  </div>
                );
              })}
            </div>
            {result ? (
              <div className="flex items-center border-b-2 border-slate-400 mt-5 p-2">
                <span className="text-slate-300 font-mono font-bold px-3 w-5/12">
                  Счет
                </span>
                <span className="text-slate-300 font-mono font-bold px-3 w-4/12 text-center">
                  Вероятность
                </span>
                <span className="text-slate-300 font-mono font-bold w-3/12 text-center">
                  Вес
                </span>
              </div>
            ) : (
              ""
            )}
            <div>
              {result?.scores?.map((el) => {
                return (
                  <div className="flex rounded-xl bg-slate-700 mt-3 p-3">
                    <span className="text-slate-200 font-mono px-3 w-5/12">
                      {el.score}{" "}
                    </span>
                    <span className="text-orange-500 font-mono px-3 w-3/12 text-center">
                      {el.probability.toFixed(1)}{" "}
                    </span>
                    <span className="text-sky-500 font-mono px-3 w-4/12 text-center">
                      {el.quantity.toFixed(0)}{" "}
                    </span>
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

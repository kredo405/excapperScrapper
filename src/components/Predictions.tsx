import { PopularBets } from "./PopularBets";
import { ErrorModal } from "./ErrorModal";
import { Loading } from "./Loading";
import apiService from "../services/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Predict } from "../types/predictions";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { calcPrediction } from "../calculation/calcPrediction";
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
  name:
    | {
        name: string;
        shortName: string;
      }
    | undefined;
  odd: number | undefined;
}

export const Predictions: React.FC = () => {
  const { link } = useParams<{ link: string }>();
  console.log(link);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [predictions, setPredictions] = useState<Predict[]>();
  const [predictors, setPredictors] = useState<Predictors[]>();
  const [odds, setOdds] = useState<Odds>();
  const [result, setResult] = useState<Result[]>([]);

  const lastMatchesData = useSelector(
    (state: RootState) => state.statistics.statistics.matches
  );

  const teamsData = useSelector(
    (state: RootState) => state.statistics.statistics.teams
  );

  const averageStatistics = useSelector(
    (state: RootState) => state.statistics.averageStatistics
  );

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
        setIsLoading(true);

        // Получаем первый ответ для получения total
        const firstResponse = await apiService.getPredictions({
          link: link,
          limit: 15,
          offset: 0,
        });

        const total = firstResponse.predictions.meta.total; // общее количество записей
        const limit = 15;

        // Считаем, сколько запросов нужно сделать
        const totalRequests = Math.ceil(total / limit);

        // Создаем массив промисов для всех запросов
        const requests = Array.from({ length: totalRequests }, (_, index) =>
          apiService.getPredictions({
            link: link,
            limit,
            offset: index * limit,
          })
        );

        // Выполняем все запросы параллельно
        const responses = await Promise.all(requests);

        // Собираем данные из всех ответов
        const allPredictions = responses.flatMap(
          (response) => response.predictions.data.predictions
        );

        const oddsResponse = await apiService.getOdds({ link: link });
        const odds = oddsResponse.odds.data.odds;

        setPredictions(allPredictions);
        setOdds(odds);
        console.log(odds);
      } catch (error) {
        ErrorModal(`Failed to fetch matches: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [link]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const querySnapshot = await getDocs(
          collection(firestore, "predictors")
        );
        const items: Predictors[] = querySnapshot.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData>) => {
            const data = doc.data() as Omit<Predictors, "id">; // Приведение данных к ожидаемому типу
            return {
              id: doc.id,
              ...data,
            };
          }
        );
        console.log(items);
        setPredictors(items);
      } catch (error) {
        console.error("Ошибка получения данных:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log(predictions);

  return (
    <>
      {isLoading ? (
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
          <div className="flex justify-center mt-10">
            <div>
              {result.length > 0 ? (
                result.map((el) => {
                  return (
                    <div className="flex rounded-xl bg-slate-700 mt-3 p-3">
                      <span className="text-slate-200 font-mono px-3">
                        {" "}
                        {el.name?.name}{" "}
                      </span>
                      <span className="text-orange-600 font-mono">
                        {" "}
                        {el.odd}{" "}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div></div>
              )}
            </div>
          </div>

          <PopularBets predictions={predictions} predictors={predictors} />
        </div>
      )}
    </>
  );
};

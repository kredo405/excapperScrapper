import { Predict } from "../types/predictions";
import { Predictors } from "../types/predictors";
import { formatBets } from "../calculation/formatBets";


interface Props {
  predictions: Predict[] | undefined;
  predictors: Predictors[] | undefined;
}

export const PopularBets: React.FC<Props> = ({ predictions, predictors }) => {

  const bestPredivtions = predictions
    ?.map((el) => {
      const desiredPredictor = predictors?.find(
        (item) => item.id === el.predictor.predictorId
      );
      const name = formatBets(el);

      return {
        ...el,
        roi: desiredPredictor?.roi,
        profit: desiredPredictor?.result,
        name: name?.shortName ? name?.shortName : "",
      };
    })
    .filter((el) => el.name !== "");
  const bestPredivtionsSorted = bestPredivtions
    ?.sort((a, b) => (a.profit && b.profit ? b.profit - a.profit : 0))
    .slice(0, 5);

  const popularBetsElements = bestPredivtionsSorted?.map((prediction, idx) => {
    return (
      <div>
        <div
          key={idx}
          className="px-3 flex justify-between rounded-lg items-center font-mono mt-2 bg-slate-600 rounded-2xl bg-opacity-80 "
        >
          <span className="text-slate-200 font-bold px-1 w-5/12">
            {prediction.name}
          </span>
          <span className="text-red-200 text-lg font-bold px-1 w-3/12 flex">
            <span className="text-slate-200 px-2">
              {prediction.profit ? prediction.profit.toFixed(0) : 0}
            </span>
          </span>
          <span className="text-red-200 text-lg font-bold px-1 w-2/12 flex">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-yellow-500"
              >
                <path
                  fillRule="evenodd"
                  d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
                  clipRule="evenodd"
                />
                <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
              </svg>
            </div>
            <span className="text-slate-200 px-2">
              {prediction.roi ? prediction.roi.toFixed(0) : 0}
            </span>
          </span>
          <span className="text-red-200 text-lg font-bold px-1 w-2/12 flex">
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-orange-500"
              >
                <path
                  fillRule="evenodd"
                  d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546 3.75 3.75 0 0 1 3.255 3.718Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-slate-200 px-2 text-center">
              {prediction.rate}
            </span>
          </span>
        </div>
      </div>
    );
  });
  return (
    <>
      <div className="mt-10 pb-10">
        <h2 className="font-mono text-xl text-center text-slate-200 font-bold">
          Прогнозисты с высокой прибылью
        </h2>
        <div className="px-3 py-2 flex items-center text-slate-200 font-mono mt-2">
          <span className="w-5/12">Ставка</span>
          <span className="w-3/12">Прибыль</span>
          <span className="w-2/12">roi</span>
          <span className="w-2/12 ">Кэф</span>
        </div>
        <div className="h-[40vh] overflow-y-scroll">{popularBetsElements}</div>
      </div>
    </>
  );
};

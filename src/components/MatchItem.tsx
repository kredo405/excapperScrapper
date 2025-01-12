import { Link } from "react-router-dom";
import { Match } from "../types/matches";

export const MatchItem = ({ match, idx }: { match: Match; idx: number }) => {
  return (
    <div>
      <Link
        key={idx}
        to={`/match/${match.slug}`}
        className="hover:bg-slate-600 bg-slate-700 w-full cursor-pointer h-16 bg-slate-50 flex justify-around items-center mb-2.5 px-2 border-1 rounded-xl border-solid border-slate-300"
      >
        <div className="flex items-center justify-center flex-col">
          <img
            src="https://img.icons8.com/?size=100&id=77826&format=png&color=000000"
            alt="man"
            className="w-[15px] md:w-[20px]"
          />
          <span
            className={
              match.predictionStats.haveExpertPredictions
                ? "text-green-100 font-bold"
                : "text-red-100 font-bold"
            }
          >
            {match.predictionStats.total}
          </span>
        </div>
        <div className="flex pr-2 items-center w-4/12">
          <img
            className="w-[20px] md:w-[30px]"
            src={`https://cdn.stavka.tv${match.teams.home.logo}`}
            alt="logo"
          />
          <span className="px-1 md:px-3 font-mono text-slate-300 text-sm lg:text-xl">
            {match.teams.home.name}
          </span>
        </div>
        <div className="flex pl-2 items-center w-4/12">
          <img
            className="w-[20px] md:w-[30px]"
            src={`https://cdn.stavka.tv${match.teams.away.logo}`}
            alt="logo"
          />
          <span className="px-1 md:px-3 font-mono text-slate-300 text-sm lg:text-xl">
            {match.teams.away.name}
          </span>
        </div>
        <div className="flex flex-col md:flex-row justify-end items-end w-2/12">
          <span className="text-xs md:text-base lg:text-lg lg:font-bold px-1 lg:px-2 font-mono text-green-200">
            {match.odds?.one_x_two.w1.value}
          </span>
          <span className="text-xs md:text-base lg:text-lg lg:font-bold px-1 lg:px-2 font-mono text-cyan-200">
            {match.odds?.one_x_two.x ? match.odds?.one_x_two.x.value : ""}
          </span>
          <span className="text-xs md:text-base lg:text-lg lg:font-bold px-1 lg:px-2 font-mono text-amber-200">
            {match.odds?.one_x_two.w2.value}
          </span>
        </div>
      </Link>
    </div>
  );
};

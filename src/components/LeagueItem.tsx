import { League } from "../types/matches";

export const LeagueItem = ({
  league,
  matchElements,
  key,
}: {
  league: League;
  matchElements: JSX.Element[];
  key: number;
}) => {
  return (
    <div key={key}>
      <div className="mb-2 p-2">
        <div className="w-full h-14 flex justify-between items-center bg-slate-800 mb-2">
          <div className="flex items-center ml-2 w-full">
            <span className="p-2 font-bold font-mono text-lg text-slate-200 flex items-center">
              <img
                className="w-7 h-7 mr-2"
                src={`https://cdn.stavka.tv${league.logo}`}
                alt="logo"
              />
              {league.country.name} {league.name}
            </span>
          </div>
        </div>
        <div>{matchElements}</div>
      </div>
    </div>
  );
};

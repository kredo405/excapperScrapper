import { Matches as MatchesType } from "../types/statistics";

interface Matches {
  lastMatchesData: MatchesType;
}

export const LastMatches: React.FC<Matches> = ({ lastMatchesData }) => {
  const renderMatches = (matches: MatchesType["pastHome"], title: string) => (
    <>
      <h2 className="font-mono text-slate-200 font-semibold text-xl text-center py-3">
        {title}
      </h2>
      {matches.map((match, idx) => (
        <div
          key={idx}
          className="hover:bg-slate-600 bg-slate-700 w-full cursor-pointer h-16 bg-slate-50 flex justify-around items-center mb-2.5 px-2 border-1 rounded-xl border-solid border-slate-300"
        >
          <div className="flex pr-2 items-center w-4/12">
            <img
              className="w-[20px] md:w-[30px]"
              src={`https://cdn.stavka.tv${match.teams.home.logo}`}
              alt={`${match.teams.home.shortName} logo`}
            />
            <span className="px-1 md:px-3 font-mono text-slate-200 text-sm lg:text-xl">
              {match.teams.home.shortName}
            </span>
          </div>
          <div className="font-mono text-slate-100 font-semibold">
            {match.result.total}
          </div>
          <div className="flex pl-2 items-center w-4/12">
            <img
              className="w-[20px] md:w-[30px]"
              src={`https://cdn.stavka.tv${match.teams.away.logo}`}
              alt={`${match.teams.away.shortName} logo`}
            />
            <span className="px-1 md:px-3 font-mono text-slate-200 text-sm lg:text-xl">
              {match.teams.away.shortName}
            </span>
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="mt-10">
      {renderMatches(
        lastMatchesData.pastHome,
        "Последние матчи домашней команды"
      )}
      {renderMatches(
        lastMatchesData.pastAway,
        "Последние матчи гостевой команды"
      )}
    </div>
  );
};
